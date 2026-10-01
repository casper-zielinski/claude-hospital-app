"use client";

import Link from "next/link";
import { setDemo, type FailMode } from "@/store/slices";
import { useAppDispatch, useAppSelector } from "@/store";
import { Select } from "@/components/ui/input";

const MODES: { id: FailMode; label: string }[] = [
  { id: "random", label: "Sometimes fail (1 in 5)" },
  { id: "always", label: "Always fail" },
  { id: "never", label: "Never fail" },
];

export function SiteFooter() {
  const dispatch = useAppDispatch();
  const demo = useAppSelector((s) => s.demo);
  return (
    <footer className="border-t-2 border-border bg-surface pb-28">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 text-muted">
        <p>
          Prototype with dummy data. Times and doctors are made up and not real medical advice.
        </p>
        <p>
          <Link href="/staff" className="font-semibold text-primary underline underline-offset-4">
            Staff area (login)
          </Link>
        </p>
        <details className="rounded-2xl border-2 border-border p-4">
          <summary className="cursor-pointer font-semibold text-foreground">
            Prototype demo controls
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="demo-travel" className="mb-1 block font-semibold text-foreground">
                Travel-time requests
              </label>
              <Select
                id="demo-travel"
                value={demo.travelError}
                onChange={(e) => dispatch(setDemo({ travelError: e.target.value as FailMode }))}
              >
                {MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="demo-wait" className="mb-1 block font-semibold text-foreground">
                Waiting-time requests
              </label>
              <Select
                id="demo-wait"
                value={demo.waitError}
                onChange={(e) => dispatch(setDemo({ waitError: e.target.value as FailMode }))}
              >
                {MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <p className="mt-3 text-sm">
            Change a setting, then pick a travel mode or symptom again (or press Try again).
          </p>
        </details>
      </div>
    </footer>
  );
}
