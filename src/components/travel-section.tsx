"use client";

import { Bike, BusFront, Car, CarTaxiFront, Check, Footprints } from "lucide-react";
import { TRAVEL_MODES, type TravelModeId } from "@/lib/constants";
import { formatMinutes } from "@/lib/triage";
import { setTravelMode } from "@/store/slices";
import { useGetTravelTimeQuery } from "@/store/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { ErrorPanel, LoadingPanel } from "@/components/state-panels";
import { StepHeading } from "@/components/status-badge";

const ICONS = {
  car: Car,
  taxi: CarTaxiFront,
  transit: BusFront,
  bike: Bike,
  walk: Footprints,
} satisfies Record<TravelModeId, unknown>;

export function TravelSection() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.selection.travelMode);
  const travel = useGetTravelTimeQuery(mode);
  const current = TRAVEL_MODES.find((m) => m.id === mode)!;
  const loading = travel.isFetching || travel.isUninitialized;

  return (
    <section
      aria-labelledby="travel-heading"
      className="overflow-hidden rounded-3xl border-2 border-primary bg-surface shadow-card-lg"
    >
      <div className="bg-primary p-5 text-primary-foreground" aria-live="polite">
        {loading ? (
          <LoadingPanel label="Calculating your travel time…" />
        ) : travel.isError ? (
          <ErrorPanel
            title="We could not calculate your travel time"
            message="Something went wrong on our side. Try again, or call the hospital and they will help you directly."
            onRetry={() => travel.refetch()}
          />
        ) : travel.currentData !== undefined ? (
          <div>
            <p className="text-lg font-semibold">
              Travel time to the hospital: {current.label.toLowerCase()}
            </p>
            <p className="font-heading text-6xl font-bold leading-tight sm:text-7xl">
              {formatMinutes(travel.currentData)}
            </p>
          </div>
        ) : null}
      </div>

      <div className="p-5">
      <StepHeading step={1} id="travel-heading">
        How will you travel to the hospital?
      </StepHeading>

      <div
        role="radiogroup"
        aria-labelledby="travel-heading"
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {TRAVEL_MODES.map((m) => {
          const Icon = ICONS[m.id];
          return (
            <label key={m.id} className="choice">
              <input
                type="radio"
                name="travel-mode"
                value={m.id}
                checked={mode === m.id}
                onChange={() => dispatch(setTravelMode(m.id))}
                className="sr-only"
              />
              <Icon aria-hidden className="size-7 shrink-0 text-primary" />
              <span className="font-semibold">{m.label}</span>
              <Check aria-hidden className="choice-check size-6" />
            </label>
          );
        })}
      </div>

      </div>
    </section>
  );
}
