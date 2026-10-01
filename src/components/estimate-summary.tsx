"use client";

import { useDoctorEstimate } from "@/hooks/use-doctor-estimate";
import { useNow } from "@/hooks/use-now";
import { clockTime } from "@/lib/triage";
import { useGetTravelTimeQuery } from "@/store/api";
import { useAppSelector } from "@/store";

/** Combines travel time and doctor wait. Only shown when both are available. */
export function EstimateSummary() {
  const mode = useAppSelector((s) => s.selection.travelMode);
  const travel = useGetTravelTimeQuery(mode);
  const { status, estimate } = useDoctorEstimate();
  const now = useNow();

  const travelMinutes = travel.currentData;
  if (
    now === null ||
    status !== "ready" ||
    !estimate ||
    travel.isFetching ||
    travel.isError ||
    travelMinutes === undefined
  ) {
    return null;
  }

  const readyIn = Math.max(travelMinutes, estimate.waitMinutes);

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-3xl border-2 border-primary bg-surface p-5 shadow-card"
    >
      <h2 id="summary-heading" className="text-xl font-bold">
        Your estimate
      </h2>
      <dl className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-muted">You arrive at about</dt>
          <dd className="text-3xl font-bold">{clockTime(now, travelMinutes)}</dd>
        </div>
        <div>
          <dt className="text-muted">{estimate.doctor.name} can see you at about</dt>
          <dd className="text-3xl font-bold">{clockTime(now, readyIn)}</dd>
        </div>
      </dl>
      {estimate.waitMinutes <= travelMinutes && (
        <p className="mt-3">The doctor will be ready when you arrive.</p>
      )}
      <p className="mt-3 text-sm text-muted">
        These are estimates and can change. Dummy data in this prototype.
      </p>
    </section>
  );
}
