"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "inline-flex h-11 w-[4.5rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-primary bg-surface transition-colors data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-8 translate-x-1 rounded-full bg-primary transition-transform data-[state=checked]:translate-x-8 data-[state=checked]:bg-surface" />
    </SwitchPrimitive.Root>
  );
}
