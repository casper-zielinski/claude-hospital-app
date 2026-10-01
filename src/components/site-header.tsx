"use client";

import Link from "next/link";
import { Check, Contrast, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOSPITAL } from "@/lib/constants";
import { setHighContrast, setTextScale, type TextScale } from "@/store/slices";
import { useAppDispatch, useAppSelector } from "@/store";

const SIZES: { id: TextScale; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "large", label: "Large" },
  { id: "xlarge", label: "Larger" },
];

const chip =
  "inline-flex min-h-11 items-center gap-1.5 rounded-xl border-2 px-3 font-semibold transition-colors";
const chipOn = "border-white bg-white text-header";
const chipOff = "border-white/70 bg-transparent text-header-foreground hover:bg-white/15";

function AccessibilityControls() {
  const dispatch = useAppDispatch();
  const { textScale, highContrast } = useAppSelector((s) => s.ui);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Display settings" role="group">
      <div role="group" aria-labelledby="text-size-label" className="flex flex-wrap items-center gap-2">
        <span id="text-size-label" className="font-semibold">
          Text size
        </span>
        {SIZES.map((size) => {
          const pressed = textScale === size.id;
          return (
            <button
              key={size.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => dispatch(setTextScale(size.id))}
              className={cn(chip, pressed ? chipOn : chipOff)}
            >
              {pressed && <Check aria-hidden className="size-4" />}
              {size.label}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        aria-pressed={highContrast}
        onClick={() => dispatch(setHighContrast(!highContrast))}
        className={cn(chip, highContrast ? chipOn : chipOff)}
      >
        {highContrast ? <Check aria-hidden className="size-4" /> : <Contrast aria-hidden className="size-4" />}
        High contrast
      </button>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="bg-header text-header-foreground shadow-card-lg">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
        <Link href="/" className="font-heading flex w-fit items-center gap-2 text-xl font-bold">
          <HeartPulse aria-hidden className="size-7" />
          <span>
            {HOSPITAL.name}
            <span className="block text-sm font-semibold opacity-90">Wait-time check</span>
          </span>
        </Link>
        <AccessibilityControls />
      </div>
    </header>
  );
}
