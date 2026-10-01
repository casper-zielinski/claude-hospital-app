"use client";

import { useEffect } from "react";
import { useStore } from "react-redux";
import { z } from "zod";
import { hydrateClinic, hydrateUi } from "@/store/slices";
import { useAppDispatch, useAppSelector, type RootState } from "@/store";

const CLINIC_KEY = "demo-clinic-v1";
const UI_KEY = "demo-ui-v1";

const doctorStatus = z.object({ available: z.boolean(), busyMinutes: z.number() });
const clinicSchema = z.object({
  isOpen: z.boolean(),
  doctors: z.object({
    general: doctorStatus,
    critical: doctorStatus,
    female: doctorStatus,
  }),
});
const uiSchema = z.object({
  textScale: z.enum(["normal", "large", "xlarge"]),
  highContrast: z.boolean(),
});

function read<T>(key: string, schema: z.ZodType<T>): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: the prototype still works without it */
  }
}

/**
 * Prototype persistence:
 * - clinic state (open/closed, doctor free/busy) so the staff panel and the patient view
 *   stay in sync across tabs, standing in for the backend.
 * - display preferences (text size, contrast).
 * Patient details are NOT persisted: they live in memory only.
 */
export function StoreHydrator() {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const ui = useAppSelector((s) => s.ui);

  useEffect(() => {
    const clinic = read(CLINIC_KEY, clinicSchema);
    if (clinic) dispatch(hydrateClinic(clinic));
    const savedUi = read(UI_KEY, uiSchema);
    if (savedUi) dispatch(hydrateUi(savedUi));

    let lastClinic = JSON.stringify(store.getState().clinic);
    let lastUi = JSON.stringify(store.getState().ui);
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const nextClinic = JSON.stringify(state.clinic);
      if (nextClinic !== lastClinic) {
        lastClinic = nextClinic;
        write(CLINIC_KEY, state.clinic);
      }
      const nextUi = JSON.stringify(state.ui);
      if (nextUi !== lastUi) {
        lastUi = nextUi;
        write(UI_KEY, state.ui);
      }
    });

    const onStorage = (event: StorageEvent) => {
      if (event.key !== CLINIC_KEY) return;
      const next = read(CLINIC_KEY, clinicSchema);
      if (next) dispatch(hydrateClinic(next));
    };
    window.addEventListener("storage", onStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", onStorage);
    };
  }, [dispatch, store]);

  useEffect(() => {
    document.documentElement.dataset.text = ui.textScale;
    document.documentElement.dataset.contrast = ui.highContrast ? "high" : "normal";
  }, [ui]);

  return null;
}
