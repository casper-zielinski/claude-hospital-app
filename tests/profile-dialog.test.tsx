import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileSection } from "@/components/profile-dialog";
import { renderWithStore } from "./test-utils";

describe("ProfileSection", () => {
  it("keeps typed text after the dialog is closed and reopened", async () => {
    const user = userEvent.setup();
    renderWithStore(<ProfileSection />);

    await user.click(screen.getByRole("button", { name: "Add your details" }));
    await user.type(screen.getByLabelText("Name"), "Max Muster");
    await user.type(screen.getByLabelText("Age (years)"), "34");

    // Close without saving
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit your details" }));
    expect(screen.getByLabelText("Name")).toHaveValue("Max Muster");
    expect(screen.getByLabelText("Age (years)")).toHaveValue("34");
  });

  it("shows a clear error for an invalid email and does not close", async () => {
    const user = userEvent.setup();
    renderWithStore(<ProfileSection />);

    await user.click(screen.getByRole("button", { name: "Add your details" }));
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Save details" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/valid email/i);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("saves valid details and closes the dialog", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<ProfileSection />);

    await user.click(screen.getByRole("button", { name: "Add your details" }));
    await user.type(screen.getByLabelText("Email"), "max@example.com");
    await user.selectOptions(screen.getByLabelText("Gender"), "male");
    await user.type(screen.getByLabelText("Height (cm)"), "182");
    await user.click(screen.getByRole("button", { name: "Save details" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(store.getState().profile).toMatchObject({
      email: "max@example.com",
      gender: "male",
      height: "182",
    });
    expect(screen.getByText("Details added")).toBeInTheDocument();
  });

  it("clears all details on request", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<ProfileSection />);

    await user.click(screen.getByRole("button", { name: "Add your details" }));
    await user.type(screen.getByLabelText("Name"), "Max");
    await user.click(screen.getByRole("button", { name: "Clear my details" }));

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(store.getState().profile.name).toBe("");
  });
});
