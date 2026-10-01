import {
  DOCTORS,
  type Doctor,
  type DoctorId,
} from "@/lib/constants";
import type { DoctorStatus } from "@/store/slices";

export interface DoctorEstimate {
  doctor: Doctor;
  available: boolean;
  /** Minutes until a busy doctor is free again (0 when available). */
  busyMinutes: number;
  /** Dummy queue of other patients ahead. */
  queueMinutes: number;
  /** Total minutes from now until this doctor can take the patient. */
  waitMinutes: number;
}

export function estimateForDoctor(
  id: DoctorId,
  status: DoctorStatus,
  queueMinutes: number,
): DoctorEstimate {
  const doctor = DOCTORS.find((d) => d.id === id)!;
  const busyMinutes = status.available ? 0 : status.busyMinutes;
  return {
    doctor,
    available: status.available,
    busyMinutes,
    queueMinutes,
    waitMinutes: busyMinutes + queueMinutes,
  };
}

/**
 * Picks the doctor who can take the patient soonest among the eligible ones.
 * Free doctors come first, then the shortest total wait.
 * A busy doctor cannot take a patient until free, so busy time counts as waiting time.
 */
export function pickDoctor(
  eligible: DoctorId[],
  statuses: Record<DoctorId, DoctorStatus>,
  queues: Record<DoctorId, number>,
): DoctorEstimate | null {
  const estimates = eligible.map((id) => estimateForDoctor(id, statuses[id], queues[id]));
  if (estimates.length === 0) return null;
  return estimates.sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    return a.waitMinutes - b.waitMinutes;
  })[0];
}

export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")} min`;
}

const clock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

export function clockTime(nowMs: number, plusMinutes: number) {
  return clock.format(new Date(nowMs + plusMinutes * 60_000));
}
