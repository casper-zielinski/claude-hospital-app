import { CircleCheck, Clock } from "lucide-react";

/** Status is always icon + text, never colour alone. */
export function StatusBadge({
  available,
  freeLabel = "Free now",
}: {
  available: boolean;
  freeLabel?: string;
}) {
  return available ? (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm font-semibold text-success">
      <CircleCheck aria-hidden className="size-4" />
      {freeLabel}
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-warning-soft px-3 py-1 text-sm font-semibold text-warning">
      <Clock aria-hidden className="size-4" />
      Busy
    </span>
  );
}

export function StepHeading({
  step,
  id,
  children,
}: {
  step: number;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="font-heading flex items-center gap-3 text-xl font-bold">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
      >
        {step}
      </span>
      <span>
        <span className="sr-only">Step {step}: </span>
        {children}
      </span>
    </h2>
  );
}
