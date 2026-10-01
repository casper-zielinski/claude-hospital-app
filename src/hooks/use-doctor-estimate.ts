"use client";

import { DEFAULT_DOCTOR_ID, SYMPTOMS, type DoctorId } from "@/lib/constants";
import { pickDoctor, type DoctorEstimate } from "@/lib/triage";
import { useGetQueueTimesQuery } from "@/store/api";
import { useAppSelector } from "@/store";

export type EstimateStatus = "idle" | "loading" | "error" | "ready";

/** Which doctor will treat the patient, and how long until that doctor is ready. */
export function useDoctorEstimate() {
  const { tab, symptomId, doctorId } = useAppSelector((s) => s.selection);
  const statuses = useAppSelector((s) => s.clinic.doctors);

  const symptom = tab === "symptom" ? SYMPTOMS.find((s) => s.id === symptomId) : undefined;
  const effectiveDoctorId: DoctorId | null =
    doctorId ?? (statuses[DEFAULT_DOCTOR_ID].available ? DEFAULT_DOCTOR_ID : null);
  const eligible: DoctorId[] =
    tab === "symptom" ? (symptom?.doctors ?? []) : effectiveDoctorId ? [effectiveDoctorId] : [];
  const hasSelection = eligible.length > 0;
  /** True when the patient picked something (not just the pre-selected default). */
  const hasExplicitSelection = symptomId !== null || doctorId !== null;

  const queues = useGetQueueTimesQuery(undefined, { skip: !hasSelection });

  let status: EstimateStatus = "idle";
  let estimate: DoctorEstimate | null = null;
  if (hasSelection) {
    if (queues.isFetching) status = "loading";
    else if (queues.isError) status = "error";
    else if (queues.data) {
      status = "ready";
      estimate = pickDoctor(eligible, statuses, queues.data);
    } else status = "loading";
  }

  return { hasSelection, hasExplicitSelection, effectiveDoctorId, symptom, status, estimate, retry: queues.refetch };
}
