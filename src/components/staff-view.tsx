"use client";

import { useAppSelector } from "@/store";
import { StaffLogin } from "@/components/staff-login";
import { StaffPanel } from "@/components/staff-panel";

export function StaffView() {
  const isStaff = useAppSelector((s) => s.auth.isStaff);
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">{isStaff ? <StaffPanel /> : <StaffLogin />}</div>
  );
}
