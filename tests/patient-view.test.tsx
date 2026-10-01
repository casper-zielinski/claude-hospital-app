import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PatientView } from "@/components/patient-view";
import { initialClinic } from "@/store/slices";
import { renderWithStore } from "./test-utils";

describe("PatientView", () => {
  it("shows a loading state, then the travel time", async () => {
    renderWithStore(<PatientView />);
    expect(screen.getByText(/calculating your travel time/i)).toBeInTheDocument();
    expect(await screen.findByText(/travel time to the hospital: car/i)).toBeInTheDocument();
  });

  it("shows the travel time for another mode after choosing it", async () => {
    const user = userEvent.setup();
    renderWithStore(<PatientView />);
    await user.click(screen.getByRole("radio", { name: "On foot" }));
    expect(await screen.findByText(/travel time to the hospital: on foot/i)).toBeInTheDocument();
  });

  it("shows an error with a call button when the travel time fails", async () => {
    renderWithStore(<PatientView />, { demo: { travelError: "always", waitError: "never" } });
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/could not calculate your travel time/i);
    expect(within(alert).getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(within(alert).getByRole("link", { name: /call hospital/i })).toHaveAttribute(
      "href",
      "tel:+43316123456",
    );
  });

  it("assigns the critical-care doctor for chest pain and warns about emergencies", async () => {
    const user = userEvent.setup();
    renderWithStore(<PatientView />);
    await user.click(screen.getByRole("tab", { name: "By symptoms" }));
    await user.click(screen.getByRole("radio", { name: /chest pain/i }));
    expect(await screen.findByText("Dr. Stefan Gruber")).toBeInTheDocument();
    expect(screen.getByText("This can be an emergency")).toBeInTheDocument();
  });

  it("keeps the travel time visible when the doctor estimate fails", async () => {
    const user = userEvent.setup();
    renderWithStore(<PatientView />, { demo: { travelError: "never", waitError: "always" } });
    await screen.findByText(/travel time to the hospital: car/i);

    await user.click(screen.getByRole("tab", { name: "By symptoms" }));
    await user.click(screen.getByRole("radio", { name: /fever/i }));
    expect(await screen.findByText(/could not estimate your waiting time/i)).toBeInTheDocument();
    expect(screen.getByText(/travel time to the hospital: car/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /call hospital/i }).length).toBeGreaterThan(0);
  });

  it("does not assign a busy doctor before a free one, and counts busy time as waiting", async () => {
    const user = userEvent.setup();
    renderWithStore(<PatientView />, {
      clinic: {
        ...initialClinic,
        doctors: {
          ...initialClinic.doctors,
          general: { available: false, busyMinutes: 60 },
        },
      },
    });
    await user.click(screen.getByRole("tab", { name: "By symptoms" }));
    await user.click(screen.getByRole("radio", { name: /fever/i }));
    // Fever can be treated by general or female doctor; the free one is chosen.
    expect(await screen.findByText("Dr. Anna Weiss")).toBeInTheDocument();
  });

  it("shows when the only possible doctor is busy", async () => {
    const user = userEvent.setup();
    renderWithStore(<PatientView />, {
      clinic: {
        ...initialClinic,
        doctors: {
          ...initialClinic.doctors,
          critical: { available: false, busyMinutes: 20 },
        },
      },
    });
    await user.click(screen.getByRole("tab", { name: "By doctor" }));
    await user.click(screen.getByRole("radio", { name: /Stefan Gruber/ }));
    expect(await screen.findByText(/is busy and cannot take new patients yet/i)).toBeInTheDocument();
  });

  it("pre-selects Dr. Markus Huber when he is free, and nobody when he is busy", async () => {
    const { unmount } = renderWithStore(<PatientView />);
    expect(await screen.findByText("You will be treated by")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Markus Huber/ })).toBeChecked();
    unmount();

    renderWithStore(<PatientView />, {
      clinic: {
        ...initialClinic,
        doctors: { ...initialClinic.doctors, general: { available: false, busyMinutes: 30 } },
      },
    });
    expect(screen.getByRole("radio", { name: /Markus Huber/ })).not.toBeChecked();
    expect(screen.queryByText("You will be treated by")).not.toBeInTheDocument();
  });

  it("hides the phone help by default and shows it on request", async () => {
    const user = userEvent.setup();
    renderWithStore(<PatientView />);
    expect(screen.queryByRole("link", { name: /emergency: call 144/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /show phone help/i }));
    expect(screen.getByRole("link", { name: /emergency: call 144/i })).toBeVisible();
  });

  it("shows the closed state with another location and an emergency button", () => {
    renderWithStore(<PatientView />, { clinic: { ...initialClinic, isOpen: false } });
    expect(screen.getByRole("heading", { name: /hospital is closed/i })).toBeInTheDocument();
    expect(screen.getByText("Demo Clinic Graz-Süd")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /emergency: call 144/i })[0]).toHaveAttribute(
      "href",
      "tel:144",
    );
    expect(screen.queryByText(/how will you travel/i)).not.toBeInTheDocument();
  });
});
