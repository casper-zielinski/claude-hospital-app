"use client";

import { Check, Phone, TriangleAlert } from "lucide-react";
import { DOCTORS, EMERGENCY_NUMBER, SYMPTOMS, telHref } from "@/lib/constants";
import { formatMinutes, type DoctorEstimate } from "@/lib/triage";
import { useDoctorEstimate } from "@/hooks/use-doctor-estimate";
import {
  clearSelection,
  selectDoctor,
  selectSymptom,
  setTab,
  type SelectionTab,
} from "@/store/slices";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorPanel, LoadingPanel } from "@/components/state-panels";
import { StatusBadge, StepHeading } from "@/components/status-badge";

function DoctorResult({
  estimate,
  autoPicked,
}: {
  estimate: DoctorEstimate;
  autoPicked: boolean;
}) {
  const { doctor, available, busyMinutes, waitMinutes } = estimate;
  return (
    <div className="rounded-2xl bg-primary-soft p-4">
      <p className="text-muted">You will be treated by</p>
      <p className="text-2xl font-bold">{doctor.name}</p>
      <p>{doctor.role}</p>
      <div className="mt-3">
        <StatusBadge available={available} />
      </div>
      {autoPicked && (
        <p className="mt-3 text-muted">We chose the doctor who can see you first.</p>
      )}
      <p className="mt-4 text-muted">Estimated waiting time</p>
      <p className="text-4xl font-bold text-primary">{formatMinutes(waitMinutes)}</p>
      {!available && (
        <p className="mt-3">
          {doctor.name} is busy and cannot take new patients yet. Expected to be free in about{" "}
          {formatMinutes(busyMinutes)}. That time is already included above.
        </p>
      )}
    </div>
  );
}

export function CareSection() {
  const dispatch = useAppDispatch();
  const { tab, symptomId } = useAppSelector((s) => s.selection);
  const statuses = useAppSelector((s) => s.clinic.doctors);
  const { hasExplicitSelection, effectiveDoctorId, symptom, status, estimate, retry } =
    useDoctorEstimate();

  return (
    <section
      aria-labelledby="care-heading"
      className="rounded-3xl border-2 border-border bg-surface p-5 shadow-card"
    >
      <StepHeading step={2} id="care-heading">
        Why are you coming? <span className="font-normal text-muted">(optional)</span>
      </StepHeading>
      <p className="mt-2 text-muted">
        Choose your symptoms or a doctor to see your waiting time. You can skip this step.
      </p>

      <Tabs
        value={tab}
        onValueChange={(value) => dispatch(setTab(value as SelectionTab))}
        className="mt-4"
      >
        <TabsList aria-label="Choose by">
          <TabsTrigger value="symptom">By symptoms</TabsTrigger>
          <TabsTrigger value="doctor">By doctor</TabsTrigger>
        </TabsList>

        <TabsContent value="symptom" className="mt-4">
          <div role="radiogroup" aria-label="Symptoms" className="grid gap-3 sm:grid-cols-2">
            {SYMPTOMS.map((s) => (
              <label key={s.id} className="choice">
                <input
                  type="radio"
                  name="symptom"
                  value={s.id}
                  checked={symptomId === s.id}
                  onChange={() => dispatch(selectSymptom(s.id))}
                  className="sr-only"
                />
                <span className="flex-1">
                  <span className="block font-semibold">{s.label}</span>
                  {s.urgent && (
                    <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-danger">
                      <TriangleAlert aria-hidden className="size-4" />
                      Urgent
                    </span>
                  )}
                </span>
                <Check aria-hidden className="choice-check size-6" />
              </label>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="doctor" className="mt-4">
          <div role="radiogroup" aria-label="Doctors" className="grid gap-3">
            {DOCTORS.map((d) => (
              <label key={d.id} className="choice">
                <input
                  type="radio"
                  name="doctor"
                  value={d.id}
                  checked={effectiveDoctorId === d.id}
                  onChange={() => dispatch(selectDoctor(d.id))}
                  className="sr-only"
                />
                <span className="flex-1">
                  <span className="block font-semibold">{d.name}</span>
                  <span className="block text-sm text-muted">
                    {d.role}. {d.description}
                  </span>
                </span>
                <StatusBadge available={statuses[d.id].available} />
                <Check aria-hidden className="choice-check size-6" />
              </label>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-5 space-y-4" aria-live="polite">
        {symptom?.urgent && (
          <div role="alert" className="rounded-2xl border-2 border-danger bg-danger-soft p-4">
            <p className="flex items-start gap-2 text-lg font-bold text-danger">
              <TriangleAlert aria-hidden className="mt-1 size-6 shrink-0" />
              This can be an emergency
            </p>
            <p className="mt-2">
              Please call {EMERGENCY_NUMBER} now instead of travelling on your own.
            </p>
            <Button asChild variant="danger" className="mt-3 w-full sm:w-auto">
              <a href={telHref(EMERGENCY_NUMBER)}>
                <Phone aria-hidden />
                Call {EMERGENCY_NUMBER}
              </a>
            </Button>
          </div>
        )}

        {status === "idle" && (
          <p className="rounded-2xl bg-background p-4 text-muted">
            {statuses.general.available
              ? "Nothing selected, and that is fine."
              : "Dr. Markus Huber is busy, so no doctor is pre-selected. Choose one or skip this step."}{" "}
            Your travel time is already shown above.
          </p>
        )}
        {status === "loading" && <LoadingPanel label="Finding the next free doctor…" />}
        {status === "error" && (
          <ErrorPanel
            title="We could not estimate your waiting time"
            message="Your travel time above is still correct. Try again, or call the hospital to ask about the wait."
            onRetry={() => retry()}
          />
        )}
        {status === "ready" && estimate && (
          <DoctorResult
            estimate={estimate}
            autoPicked={tab === "symptom" && (symptom?.doctors.length ?? 0) > 1}
          />
        )}

        {hasExplicitSelection && (
          <Button variant="ghost" onClick={() => dispatch(clearSelection())}>
            Clear selection
          </Button>
        )}
      </div>
    </section>
  );
}
