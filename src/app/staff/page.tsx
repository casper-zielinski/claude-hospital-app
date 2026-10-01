import type { Metadata } from "next";
import { StaffView } from "@/components/staff-view";

export const metadata: Metadata = {
  title: "Staff panel | Demo Hospital Graz",
};

export default function StaffPage() {
  return <StaffView />;
}
