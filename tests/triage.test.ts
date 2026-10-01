import { describe, expect, it } from "vitest";
import { clockTime, formatMinutes, pickDoctor } from "@/lib/triage";
import type { DoctorId } from "@/lib/constants";
import { initialClinic, type DoctorStatus } from "@/store/slices";

const free = (): Record<DoctorId, DoctorStatus> => structuredClone(initialClinic.doctors);
const queues: Record<DoctorId, number> = { general: 30, critical: 5, female: 20 };

describe("pickDoctor", () => {
  it("returns null when nobody is eligible", () => {
    expect(pickDoctor([], free(), queues)).toBeNull();
  });

  it("picks the eligible doctor with the shortest wait", () => {
    const result = pickDoctor(["general", "female"], free(), queues);
    expect(result?.doctor.id).toBe("female");
    expect(result?.waitMinutes).toBe(20);
  });

  it("prefers a free doctor over a busy one, even when the busy one has a shorter queue", () => {
    const statuses = free();
    statuses.female = { available: false, busyMinutes: 5 };
    const result = pickDoctor(["general", "female"], statuses, { ...queues, female: 1 });
    expect(result?.doctor.id).toBe("general");
    expect(result?.available).toBe(true);
  });

  it("adds busy minutes to the wait when the only eligible doctor is busy", () => {
    const statuses = free();
    statuses.critical = { available: false, busyMinutes: 15 };
    const result = pickDoctor(["critical"], statuses, queues);
    expect(result?.available).toBe(false);
    expect(result?.busyMinutes).toBe(15);
    expect(result?.waitMinutes).toBe(20);
  });
});

describe("formatting", () => {
  it("formats minutes", () => {
    expect(formatMinutes(7)).toBe("7 min");
    expect(formatMinutes(60)).toBe("1 h");
    expect(formatMinutes(75)).toBe("1 h 15 min");
  });

  it("formats a clock time from a start and an offset", () => {
    const start = new Date(2026, 9, 1, 17, 30).getTime();
    expect(clockTime(start, 25)).toBe("17:55");
  });
});
