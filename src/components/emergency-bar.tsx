"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Phone, Siren } from "lucide-react";
import { EMERGENCY_NUMBER, HOSPITAL, telHref } from "@/lib/constants";
import { Button } from "@/components/ui/button";

/** Fixed to the bottom of the screen. Collapsed by default so the travel time stays the focus. */
export function EmergencyBar() {
  const [open, setOpen] = useState(false);

  return (
    <aside
      aria-label="Phone help"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-surface px-4 py-2 shadow-card-lg"
    >
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="phone-help-panel"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl font-semibold text-primary"
        >
          <Phone aria-hidden className="size-5" />
          {open ? "Hide phone help" : "Show phone help"}
          {open ? <ChevronDown aria-hidden className="size-5" /> : <ChevronUp aria-hidden className="size-5" />}
        </button>
        <div id="phone-help-panel" hidden={!open} className="mt-2 grid grid-cols-2 gap-3 pb-1">
          <Button asChild variant="danger" size="lg">
            <a href={telHref(EMERGENCY_NUMBER)}>
              <Siren aria-hidden />
              Emergency: call {EMERGENCY_NUMBER}
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={telHref(HOSPITAL.phone)}>
              <Phone aria-hidden />
              Call hospital
            </a>
          </Button>
        </div>
      </div>
    </aside>
  );
}
