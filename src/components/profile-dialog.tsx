"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleCheck, UserRound } from "lucide-react";
import { clearProfile, emptyProfile, setProfile, type ProfileState } from "@/store/slices";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { StepHeading } from "@/components/status-badge";

/** Empty is fine (all fields are optional); otherwise a number inside [min, max]. */
const inRange = (min: number, max: number) => (value: string) =>
  value === "" || (/^\d+(\.\d+)?$/.test(value) && Number(value) >= min && Number(value) <= max);

const schema = z.object({
  name: z.string().max(100, "Use at most 100 characters"),
  email: z
    .string()
    .max(120, "Use at most 120 characters")
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address, like name@example.com"),
  phone: z
    .string()
    .max(30, "Use at most 30 characters")
    .refine((v) => v === "" || /^[+()\d\s/-]{5,}$/.test(v), "Enter a valid phone number, like +43 316 123456"),
  gender: z.enum(["", "female", "male", "diverse", "no-answer"]),
  age: z.string().refine(inRange(0, 120), "Age must be between 0 and 120"),
  height: z.string().refine(inRange(30, 250), "Height must be between 30 and 250 cm"),
  weight: z.string().refine(inRange(1, 400), "Weight must be between 1 and 400 kg"),
});

type FormValues = z.infer<typeof schema>;

function Field({
  name,
  label,
  error,
  children,
}: {
  name: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1 font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function ProfileForm({ onDone }: { onDone: () => void }) {
  const dispatch = useAppDispatch();
  const stored = useAppSelector((s) => s.profile);
  // Start from what was typed before: closing the dialog never loses input.
  const [initial] = useState<FormValues>(stored);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial,
  });
  const { register, handleSubmit, reset, control, formState } = form;
  const { errors } = formState;

  // Save every keystroke to the store (memory only), even if the dialog is closed unsaved.
  const values = useWatch({ control });
  useEffect(() => {
    dispatch(setProfile(values as Partial<ProfileState>));
  }, [values, dispatch]);

  const props = (name: keyof FormValues) => ({
    id: name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    ...register(name),
  });

  return (
    <form
      noValidate
      className="mt-5 grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit((values) => {
        dispatch(setProfile(values));
        onDone();
      })}
    >
      <div className="sm:col-span-2">
        <Field name="name" label="Name" error={errors.name?.message}>
          <Input type="text" autoComplete="name" {...props("name")} />
        </Field>
      </div>
      <Field name="email" label="Email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" {...props("email")} />
      </Field>
      <Field name="phone" label="Phone" error={errors.phone?.message}>
        <Input type="tel" autoComplete="tel" {...props("phone")} />
      </Field>
      <Field name="gender" label="Gender" error={errors.gender?.message}>
        <Select {...props("gender")}>
          <option value="">Choose (optional)</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="diverse">Diverse</option>
          <option value="no-answer">Prefer not to say</option>
        </Select>
      </Field>
      <Field name="age" label="Age (years)" error={errors.age?.message}>
        <Input type="text" inputMode="numeric" {...props("age")} />
      </Field>
      <Field name="height" label="Height (cm)" error={errors.height?.message}>
        <Input type="text" inputMode="decimal" {...props("height")} />
      </Field>
      <Field name="weight" label="Weight (kg)" error={errors.weight?.message}>
        <Input type="text" inputMode="decimal" {...props("weight")} />
      </Field>

      <div className="mt-2 flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <Button type="submit" size="lg">
          Save details
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            reset(emptyProfile);
            dispatch(clearProfile());
          }}
        >
          Clear my details
        </Button>
      </div>
    </form>
  );
}

export function ProfileSection() {
  const [open, setOpen] = useState(false);
  const profile = useAppSelector((s) => s.profile);
  const hasDetails = Object.values(profile).some(Boolean);

  return (
    <section
      aria-labelledby="profile-heading"
      className="rounded-3xl border-2 border-border bg-surface p-5 shadow-card"
    >
      <StepHeading step={3} id="profile-heading">
        Your details <span className="font-normal text-muted">(optional)</span>
      </StepHeading>
      <p className="mt-2 text-muted">
        Add your name, contact and body details so staff can prepare. You can skip this.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="mt-4 w-full sm:w-auto">
            <UserRound aria-hidden />
            {hasDetails ? "Edit your details" : "Add your details"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Your details</DialogTitle>
          <DialogDescription>
            All fields are optional. Your input is kept in this browser tab only and is not sent
            anywhere in this prototype.
          </DialogDescription>
          <ProfileForm onDone={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      {hasDetails && (
        <p className="mt-3 flex items-center gap-2 font-semibold text-success">
          <CircleCheck aria-hidden className="size-5" />
          Details added
        </p>
      )}
    </section>
  );
}
