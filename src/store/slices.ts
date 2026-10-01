import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DoctorId, TravelModeId } from "@/lib/constants";

/* ---------- ui (display preferences) ---------- */
export type TextScale = "normal" | "large" | "xlarge";
export interface UiState {
  textScale: TextScale;
  highContrast: boolean;
}
const uiSlice = createSlice({
  name: "ui",
  initialState: { textScale: "normal", highContrast: false } as UiState,
  reducers: {
    setTextScale(state, action: PayloadAction<TextScale>) {
      state.textScale = action.payload;
    },
    setHighContrast(state, action: PayloadAction<boolean>) {
      state.highContrast = action.payload;
    },
    hydrateUi: (_state, action: PayloadAction<UiState>) => action.payload,
  },
});
export const { setTextScale, setHighContrast, hydrateUi } = uiSlice.actions;

/* ---------- selection (what the patient picked) ---------- */
export type SelectionTab = "symptom" | "doctor";
export interface SelectionState {
  travelMode: TravelModeId;
  tab: SelectionTab;
  symptomId: string | null;
  doctorId: DoctorId | null;
}
const selectionSlice = createSlice({
  name: "selection",
  initialState: {
    travelMode: "car",
    // "doctor" tab with doctorId null means: use DEFAULT_DOCTOR_ID if that doctor is free.
    tab: "doctor",
    symptomId: null,
    doctorId: null,
  } as SelectionState,
  reducers: {
    setTravelMode(state, action: PayloadAction<TravelModeId>) {
      state.travelMode = action.payload;
    },
    setTab(state, action: PayloadAction<SelectionTab>) {
      state.tab = action.payload;
    },
    selectSymptom(state, action: PayloadAction<string | null>) {
      state.symptomId = action.payload;
    },
    selectDoctor(state, action: PayloadAction<DoctorId | null>) {
      state.doctorId = action.payload;
    },
    clearSelection(state) {
      state.symptomId = null;
      state.doctorId = null;
    },
  },
});
export const { setTravelMode, setTab, selectSymptom, selectDoctor, clearSelection } =
  selectionSlice.actions;

/* ---------- profile (optional patient details, memory only) ---------- */
export interface ProfileState {
  name: string;
  email: string;
  phone: string;
  gender: "" | "female" | "male" | "diverse" | "no-answer";
  age: string;
  height: string;
  weight: string;
}
export const emptyProfile: ProfileState = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  age: "",
  height: "",
  weight: "",
};
const profileSlice = createSlice({
  name: "profile",
  initialState: emptyProfile,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<ProfileState>>) => ({
      ...state,
      ...action.payload,
    }),
    clearProfile: () => emptyProfile,
  },
});
export const { setProfile, clearProfile } = profileSlice.actions;

/* ---------- clinic (what staff control) ---------- */
export interface DoctorStatus {
  available: boolean;
  /** Minutes until the doctor is free again (only meaningful while busy). */
  busyMinutes: number;
}
export interface ClinicState {
  isOpen: boolean;
  doctors: Record<DoctorId, DoctorStatus>;
}
export const DEFAULT_BUSY_MINUTES = 15;
export const initialClinic: ClinicState = {
  isOpen: true,
  doctors: {
    general: { available: true, busyMinutes: 0 },
    critical: { available: true, busyMinutes: 0 },
    female: { available: true, busyMinutes: 0 },
  },
};
const clinicSlice = createSlice({
  name: "clinic",
  initialState: initialClinic,
  reducers: {
    setHospitalOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    setDoctorAvailable(state, action: PayloadAction<{ id: DoctorId; available: boolean }>) {
      const doctor = state.doctors[action.payload.id];
      doctor.available = action.payload.available;
      doctor.busyMinutes = action.payload.available
        ? 0
        : doctor.busyMinutes || DEFAULT_BUSY_MINUTES;
    },
    setDoctorBusyMinutes(state, action: PayloadAction<{ id: DoctorId; minutes: number }>) {
      state.doctors[action.payload.id].busyMinutes = action.payload.minutes;
    },
    hydrateClinic: (_state, action: PayloadAction<ClinicState>) => action.payload,
  },
});
export const { setHospitalOpen, setDoctorAvailable, setDoctorBusyMinutes, hydrateClinic } =
  clinicSlice.actions;

/* ---------- auth (prototype staff login, memory only) ---------- */
const authSlice = createSlice({
  name: "auth",
  initialState: { isStaff: false },
  reducers: {
    loginSucceeded: (state) => {
      state.isStaff = true;
    },
    loggedOut: (state) => {
      state.isStaff = false;
    },
  },
});
export const { loginSucceeded, loggedOut } = authSlice.actions;

/* ---------- demo (simulate failing requests) ---------- */
export type FailMode = "random" | "always" | "never";
export interface DemoState {
  travelError: FailMode;
  waitError: FailMode;
}
const demoSlice = createSlice({
  name: "demo",
  initialState: { travelError: "random", waitError: "random" } as DemoState,
  reducers: {
    setDemo: (state, action: PayloadAction<Partial<DemoState>>) => ({
      ...state,
      ...action.payload,
    }),
  },
});
export const { setDemo } = demoSlice.actions;

export const reducers = {
  ui: uiSlice.reducer,
  selection: selectionSlice.reducer,
  profile: profileSlice.reducer,
  clinic: clinicSlice.reducer,
  auth: authSlice.reducer,
  demo: demoSlice.reducer,
};
