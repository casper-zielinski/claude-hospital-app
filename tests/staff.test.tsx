import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StaffView } from "@/components/staff-view";
import { renderWithStore } from "./test-utils";

describe("StaffView", () => {
  it("rejects a wrong password with a clear message", async () => {
    const user = userEvent.setup();
    renderWithStore(<StaffView />);

    await user.type(screen.getByLabelText("Email"), "staff@gmail.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/wrong/i);
    expect(screen.queryByRole("heading", { name: "Staff panel" })).not.toBeInTheDocument();
  });

  it("asks for missing fields", async () => {
    const user = userEvent.setup();
    renderWithStore(<StaffView />);
    await user.click(screen.getByRole("button", { name: "Log in" }));
    expect(await screen.findByText("Enter your email address")).toBeInTheDocument();
    expect(screen.getByText("Enter your password")).toBeInTheDocument();
  });

  it("logs in with the prototype account and lets staff set a doctor busy and free", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<StaffView />);

    await user.type(screen.getByLabelText("Email"), "staff@gmail.com");
    await user.type(screen.getByLabelText("Password"), "123456789");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(await screen.findByRole("heading", { name: "Staff panel" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);

    const toggle = screen.getByRole("switch", { name: "Dr. Markus Huber available" });
    await user.click(toggle);
    expect(store.getState().clinic.doctors.general.available).toBe(false);
    expect(screen.getByLabelText("Expected to be free again in")).toBeInTheDocument();

    await user.click(toggle);
    expect(store.getState().clinic.doctors.general.available).toBe(true);
  });

  it("closes the hospital and logs out", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<StaffView />, { auth: { isStaff: true } });

    await user.click(screen.getByRole("switch", { name: "Hospital open" }));
    expect(store.getState().clinic.isOpen).toBe(false);

    await user.click(screen.getByRole("button", { name: "Log out" }));
    expect(screen.getByRole("heading", { name: "Staff login" })).toBeInTheDocument();
  });
});
