import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import axe from "axe-core";
import { PatientView } from "@/components/patient-view";
import { StaffLogin } from "@/components/staff-login";
import { renderWithStore } from "./test-utils";

// jsdom cannot compute colours or layout, so contrast is checked by the token choices
// (see globals.css) and later by Playwright + axe in a real browser.
const options = { rules: { "color-contrast": { enabled: false } } };

describe("accessibility smoke tests (axe)", () => {
  it("patient view has no detectable violations", async () => {
    const { container } = renderWithStore(<PatientView />);
    await screen.findByText(/travel time to the hospital/i);
    const results = await axe.run(container, options);
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  it("staff login has no detectable violations", async () => {
    const { container } = renderWithStore(<StaffLogin />);
    const results = await axe.run(container, options);
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
