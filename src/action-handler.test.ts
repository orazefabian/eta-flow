// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { html, render } from "lit";
import { actionHandler, type ActionHandlerOptions } from "./action-handler";

/** Render one element carrying the directive and collect the actions it fires. */
function mount(options: ActionHandlerOptions) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const actions: string[] = [];
  render(
    html`<div
      ${actionHandler(options)}
      @action=${(ev: CustomEvent) => actions.push(ev.detail.action)}
    ></div>`,
    container,
  );
  return { element: container.firstElementChild as HTMLElement, actions };
}

const press = (element: Element) => element.dispatchEvent(new MouseEvent("mousedown"));
const release = (element: Element) => {
  element.dispatchEvent(new MouseEvent("mouseup"));
  element.dispatchEvent(new MouseEvent("click"));
};

describe("actionHandler", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("fires tap immediately when no other gesture is configured", () => {
    const { element, actions } = mount({});
    press(element);
    release(element);
    expect(actions).toEqual(["tap"]);
  });

  it("fires hold after the press is held, and not a tap as well", () => {
    const { element, actions } = mount({ hasHold: true });
    press(element);
    vi.advanceTimersByTime(600);
    expect(actions).toEqual(["hold"]);
    release(element);
    expect(actions).toEqual(["hold"]);
  });

  it("fires tap when the press is released before the hold delay", () => {
    const { element, actions } = mount({ hasHold: true });
    press(element);
    vi.advanceTimersByTime(200);
    release(element);
    expect(actions).toEqual(["tap"]);
  });

  it("waits before reporting a tap when a double tap is configured", () => {
    const { element, actions } = mount({ hasDoubleClick: true });
    press(element);
    release(element);
    expect(actions).toEqual([]);
    vi.advanceTimersByTime(300);
    expect(actions).toEqual(["tap"]);
  });

  it("reports a double tap for two quick clicks", () => {
    const { element, actions } = mount({ hasDoubleClick: true });
    press(element);
    release(element);
    vi.advanceTimersByTime(100);
    press(element);
    release(element);
    vi.advanceTimersByTime(300);
    expect(actions).toEqual(["double_tap"]);
  });

  it("stays silent when disabled", () => {
    const { element, actions } = mount({ disabled: true });
    press(element);
    release(element);
    vi.advanceTimersByTime(1000);
    expect(actions).toEqual([]);
  });
});
