"use client";

import Link from "next/link";
import { Ban, CircleCheck, LogOut } from "lucide-react";
import { DOCTORS } from "@/lib/constants";
import {
  loggedOut,
  setDoctorAvailable,
  setDoctorBusyMinutes,
  setHospitalOpen,
} from "@/store/slices";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/status-badge";

const BUSY_OPTIONS = [5, 10, 15, 20, 30, 45, 60, 90];

export function StaffPanel() {
  const dispatch = useAppDispatch();
  const { isOpen, doctors } = useAppSelector((s) => s.clinic);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Staff panel</h1>
          <p className="mt-1 text-muted">
            Changes show up for patients right away.{" "}
            <Link href="/" className="font-semibold text-primary underline underline-offset-4">
              Open patient view
            </Link>
          </p>
        </div>
        <Button variant="outline" onClick={() => dispatch(loggedOut())}>
          <LogOut aria-hidden />
          Log out
        </Button>
      </div>

      <section
        aria-labelledby="hospital-heading"
        className="rounded-3xl border-2 border-border bg-surface p-5 shadow-card"
      >
        <h2 id="hospital-heading" className="text-xl font-bold">
          Hospital
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <Switch
            checked={isOpen}
            onCheckedChange={(value) => dispatch(setHospitalOpen(value))}
            aria-label="Hospital open"
          />
          <span className="inline-flex items-center gap-2 text-lg font-semibold">
            {isOpen ? (
              <>
                <CircleCheck aria-hidden className="size-5 text-success" />
                Open: patients can arrive
              </>
            ) : (
              <>
                <Ban aria-hidden className="size-5 text-danger" />
                Closed: no patients can be treated
              </>
            )}
          </span>
        </div>
        <p className="mt-3 text-muted">
          When closed, patients see that arrival is not possible and get another location and an
          emergency call button.
        </p>
      </section>

      <section aria-labelledby="doctors-heading">
        <h2 id="doctors-heading" className="text-xl font-bold">
          Doctors
        </h2>
        <ul className="mt-3 space-y-4">
          {DOCTORS.map((doctor) => {
            const status = doctors[doctor.id];
            return (
              <li
                key={doctor.id}
                className="rounded-3xl border-2 border-border bg-surface p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">{doctor.name}</h3>
                    <p className="text-muted">{doctor.role}</p>
                  </div>
                  <StatusBadge available={status.available} freeLabel="Free" />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Switch
                    checked={status.available}
                    onCheckedChange={(value) =>
                      dispatch(setDoctorAvailable({ id: doctor.id, available: value }))
                    }
                    aria-label={`${doctor.name} available`}
                  />
                  <span className="font-semibold">
                    {status.available ? "Free: can take the next patient" : "Busy: cannot take patients"}
                  </span>
                </div>

                {!status.available && (
                  <div className="mt-4 max-w-sm">
                    <label htmlFor={`busy-${doctor.id}`} className="mb-1 block font-semibold">
                      Expected to be free again in
                    </label>
                    <Select
                      id={`busy-${doctor.id}`}
                      value={status.busyMinutes}
                      onChange={(e) =>
                        dispatch(
                          setDoctorBusyMinutes({ id: doctor.id, minutes: Number(e.target.value) }),
                        )
                      }
                    >
                      {BUSY_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m} minutes
                        </option>
                      ))}
                    </Select>
                    <p className="mt-2 text-muted">
                      Patients see this time added to their wait. A busy doctor is not assigned
                      patients until free.
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
