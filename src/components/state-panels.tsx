import { Loader2, Phone, RefreshCw, TriangleAlert } from "lucide-react";
import { HOSPITAL, telHref } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function LoadingPanel({ label }: { label: string }) {
  return (
    <div role="status" className="rounded-2xl border-2 border-border bg-surface p-4 text-foreground">
      <div className="flex items-center gap-3 font-semibold">
        <Loader2 aria-hidden className="size-6 animate-spin text-primary" />
        <span>{label}</span>
      </div>
      <div aria-hidden className="mt-4 space-y-2">
        <div className="h-8 w-1/2 animate-pulse rounded-lg bg-primary-soft" />
        <div className="h-4 w-full animate-pulse rounded bg-primary-soft" />
      </div>
    </div>
  );
}

export function ErrorPanel({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div role="alert" className="rounded-2xl border-2 border-danger bg-danger-soft p-4 text-foreground">
      <p className="flex items-start gap-2 text-lg font-bold text-danger">
        <TriangleAlert aria-hidden className="mt-1 size-6 shrink-0" />
        {title}
      </p>
      <p className="mt-2">{message}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onRetry}>
          <RefreshCw aria-hidden />
          Try again
        </Button>
        <Button asChild variant="outline">
          <a href={telHref(HOSPITAL.phone)}>
            <Phone aria-hidden />
            Call hospital: {HOSPITAL.phone}
          </a>
        </Button>
      </div>
    </div>
  );
}
