import { Ban, Phone, Siren } from "lucide-react";
import {
  ALTERNATIVE_LOCATION,
  EMERGENCY_NUMBER,
  telHref,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function HospitalClosed() {
  return (
    <section
      aria-labelledby="closed-heading"
      className="rounded-3xl border-2 border-danger bg-danger-soft p-5"
    >
      <h2 id="closed-heading" className="flex items-start gap-2 text-2xl font-bold text-danger">
        <Ban aria-hidden className="mt-1 size-7 shrink-0" />
        The hospital is closed right now
      </h2>
      <p className="mt-2 text-lg">
        Please do not travel here. Patients cannot arrive or be treated until it opens again.
      </p>
      <div className="mt-4 rounded-2xl bg-surface p-4">
        <p className="font-semibold text-muted">Go to this location instead</p>
        <p className="text-xl font-bold">{ALTERNATIVE_LOCATION.name}</p>
        <p>{ALTERNATIVE_LOCATION.address}</p>
        <Button asChild variant="outline" className="mt-3 w-full sm:w-auto">
          <a href={telHref(ALTERNATIVE_LOCATION.phone)}>
            <Phone aria-hidden />
            Call {ALTERNATIVE_LOCATION.phone}
          </a>
        </Button>
      </div>
      <Button asChild variant="danger" size="lg" className="mt-4 w-full">
        <a href={telHref(EMERGENCY_NUMBER)}>
          <Siren aria-hidden />
          Emergency: call {EMERGENCY_NUMBER}
        </a>
      </Button>
    </section>
  );
}
