"use client";

import { Ban, CircleCheck, MapPin } from "lucide-react";
import { HOSPITAL } from "@/lib/constants";
import { useAppSelector } from "@/store";
import { CareSection } from "@/components/care-section";
import { EmergencyBar } from "@/components/emergency-bar";
import { EstimateSummary } from "@/components/estimate-summary";
import { HospitalClosed } from "@/components/hospital-closed";
import { ProfileSection } from "@/components/profile-dialog";
import { TravelSection } from "@/components/travel-section";

export function PatientView() {
  const isOpen = useAppSelector((s) => s.clinic.isOpen);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pb-24 pt-6">
      <h1 className="text-2xl font-bold leading-tight">Check your wait before you arrive</h1>

      {isOpen && <TravelSection />}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border-2 border-border bg-surface p-4 shadow-card">
        {isOpen ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-success">
            <CircleCheck aria-hidden className="size-5" />
            Open now
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-semibold text-danger">
            <Ban aria-hidden className="size-5" />
            Closed
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <MapPin aria-hidden className="size-5 text-primary" />
          {HOSPITAL.name}, {HOSPITAL.address}
        </span>
      </div>

      {isOpen ? (
        <>
          <CareSection />
          <EstimateSummary />
          <ProfileSection />
        </>
      ) : (
        <HospitalClosed />
      )}

      <EmergencyBar />
    </div>
  );
}
