"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("grid grid-cols-2 gap-2 rounded-2xl bg-primary-soft p-1.5", className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "min-h-12 rounded-xl px-3 py-2 font-semibold text-primary transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}
