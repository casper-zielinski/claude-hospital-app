import { describe, expect, it } from "vitest";
import { makeStore } from "@/store";
import {
  DEFAULT_BUSY_MINUTES,
  clearProfile,
  clearSelection,
  loggedOut,
  loginSucceeded,
  selectDoctor,
  selectSymptom,
  setDoctorAvailable,
  setDoctorBusyMinutes,
  setHospitalOpen,
  setProfile,
  setTab,
  setTravelMode,
} from "@/store/slices";

describe("clinic slice", () => {
  it("starts open with three free doctors", () => {
    const { clinic } = makeStore().getState();
    expect(clinic.isOpen).toBe(true);
    expect(Object.values(clinic.doctors).every((d) => d.available)).toBe(true);
  });

  it("marks a doctor busy with a default time, then free again", () => {
    const store = makeStore();
    store.dispatch(setDoctorAvailable({ id: "general", available: false }));
    expect(store.getState().clinic.doctors.general).toEqual({
      available: false,
      busyMinutes: DEFAULT_BUSY_MINUTES,
    });
    store.dispatch(setDoctorBusyMinutes({ id: "general", minutes: 30 }));
    expect(store.getState().clinic.doctors.general.busyMinutes).toBe(30);
    store.dispatch(setDoctorAvailable({ id: "general", available: true }));
    expect(store.getState().clinic.doctors.general).toEqual({ available: true, busyMinutes: 0 });
  });

  it("opens and closes the hospital", () => {
    const store = makeStore();
    store.dispatch(setHospitalOpen(false));
    expect(store.getState().clinic.isOpen).toBe(false);
  });
});

describe("selection slice", () => {
  it("keeps travel mode and tab, and clears symptom and doctor", () => {
    const store = makeStore();
    store.dispatch(setTravelMode("bike"));
    store.dispatch(setTab("doctor"));
    store.dispatch(selectSymptom("fever"));
    store.dispatch(selectDoctor("female"));
    store.dispatch(clearSelection());
    const s = store.getState().selection;
    expect(s).toEqual({ travelMode: "bike", tab: "doctor", symptomId: null, doctorId: null });
  });
});

describe("profile slice", () => {
  it("merges partial updates and clears everything", () => {
    const store = makeStore();
    store.dispatch(setProfile({ name: "Max" }));
    store.dispatch(setProfile({ age: "34" }));
    expect(store.getState().profile).toMatchObject({ name: "Max", age: "34", email: "" });
    store.dispatch(clearProfile());
    expect(Object.values(store.getState().profile).every((v) => v === "")).toBe(true);
  });
});

describe("auth slice", () => {
  it("logs in and out", () => {
    const store = makeStore();
    store.dispatch(loginSucceeded());
    expect(store.getState().auth.isStaff).toBe(true);
    store.dispatch(loggedOut());
    expect(store.getState().auth.isStaff).toBe(false);
  });
});
