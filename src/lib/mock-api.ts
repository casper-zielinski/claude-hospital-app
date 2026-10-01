import { DOCTORS, TRAVEL_MODES, type DoctorId, type TravelModeId } from "@/lib/constants";
import type { FailMode } from "@/store/slices";

/**
 * Fake backend for the prototype. Replace with the Spring Boot API later.
 * Latency is skipped under test so unit tests stay fast and deterministic.
 */

export class MockApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MockApiError";
  }
}

const FAILURE_RATE = 0.2;

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const wait = (min: number, max: number) =>
  new Promise<void>((resolve) =>
    setTimeout(resolve, process.env.NODE_ENV === "test" ? 0 : randomBetween(min, max)),
  );

function shouldFail(mode: FailMode) {
  if (mode === "always") return true;
  if (mode === "never") return false;
  return Math.random() < FAILURE_RATE;
}

export async function fetchTravelMinutes(mode: TravelModeId, failMode: FailMode) {
  await wait(700, 1400);
  if (shouldFail(failMode)) {
    throw new MockApiError("The route service did not respond.");
  }
  const [min, max] = TRAVEL_MODES.find((m) => m.id === mode)!.range;
  return randomBetween(min, max);
}

export async function fetchQueueMinutes(failMode: FailMode) {
  await wait(800, 1600);
  if (shouldFail(failMode)) {
    throw new MockApiError("The waiting-time service did not respond.");
  }
  return Object.fromEntries(
    DOCTORS.map((d) => [d.id, randomBetween(...d.queueRange)]),
  ) as Record<DoctorId, number>;
}
