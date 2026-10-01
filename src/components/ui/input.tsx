import * as React from "react";
import { cn } from "@/lib/utils";

const field =
  "min-h-12 w-full rounded-xl border-2 border-border bg-surface px-4 py-2 text-base text-foreground aria-[invalid=true]:border-danger";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(field, className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(field, className)} {...props} />;
}
