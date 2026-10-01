"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { PROTOTYPE_STAFF } from "@/lib/constants";
import { loginSucceeded } from "@/store/slices";
import { useAppDispatch } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().min(1, "Enter your email address"),
  password: z.string().min(1, "Enter your password"),
});
type FormValues = z.infer<typeof schema>;

export function StaffLogin() {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = (values: FormValues) => {
    // PROTOTYPE ONLY: hard-coded check in the browser. Real login goes through Keycloak.
    if (
      values.email.trim().toLowerCase() === PROTOTYPE_STAFF.email &&
      values.password === PROTOTYPE_STAFF.password
    ) {
      dispatch(loginSucceeded());
    } else {
      setError("root", { message: "Email or password is wrong. Check both and try again." });
    }
  };

  return (
    <section
      aria-labelledby="login-heading"
      className="rounded-3xl border-2 border-border bg-surface p-5 shadow-card sm:p-7"
    >
      <h1 id="login-heading" className="text-3xl font-bold">
        Staff login
      </h1>
      <p className="mt-2 text-muted">For doctors and reception. Patients do not need to log in.</p>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 font-semibold text-danger">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-semibold">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1 font-semibold text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p role="alert" className="rounded-xl border-2 border-danger bg-danger-soft p-3 font-semibold text-danger">
            {errors.root.message}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <LogIn aria-hidden />
          Log in
        </Button>
      </form>

      <p className="mt-6 rounded-2xl bg-warning-soft p-4 text-warning">
        <strong>Prototype login.</strong> Email: {PROTOTYPE_STAFF.email}, password:{" "}
        {PROTOTYPE_STAFF.password}. This is a hard-coded test account and will be replaced.
      </p>
    </section>
  );
}
