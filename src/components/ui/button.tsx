import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-center font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        danger: "bg-danger text-danger-foreground hover:bg-danger/90",
        outline: "border-2 border-primary bg-surface text-primary hover:bg-primary-soft",
        ghost: "text-primary hover:bg-primary-soft",
      },
      size: {
        sm: "min-h-11 px-4 py-2 text-base",
        default: "min-h-12 px-5 py-2",
        lg: "min-h-14 px-5 py-3 text-lg",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild) return <Slot className={classes} {...props} />;
  return <button type={type ?? "button"} className={classes} {...props} />;
}
