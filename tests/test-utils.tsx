import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore, type RootState } from "@/store";

const deterministic = { demo: { travelError: "never", waitError: "never" } } as Partial<RootState>;

/** Renders with a fresh store. Simulated failures are off unless a test turns them on. */
export function renderWithStore(ui: React.ReactElement, preloaded: Partial<RootState> = {}) {
  const store = makeStore({ ...deterministic, ...preloaded });
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}
