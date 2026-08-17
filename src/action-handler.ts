import { noChange } from "lit";
import {
  directive,
  Directive,
  PartType,
  type ElementPart,
  type Part,
  type PartInfo,
} from "lit/directive.js";

/**
 * Tap / hold / double-tap recognition for the card's clickable shapes.
 *
 * Home Assistant's own cards use an `action-handler` directive for this, but it is
 * internal to the frontend and not re-exported by `custom-card-helpers`, so the card
 * ships its own. It attaches pointer listeners to an element and fires a single
 * `action` event whose detail says which gesture happened; `handleAction` then maps
 * that to the configured `tap_action` / `hold_action` / `double_tap_action`.
 */

const HOLD_MS = 500;
const DOUBLE_TAP_MS = 250;

export interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
  disabled?: boolean;
}

interface Bound {
  options: ActionHandlerOptions;
  start?: (ev: Event) => void;
  end?: (ev: Event) => void;
  cancel?: () => void;
}

/** An element the directive has attached listeners to. */
type Bindable = Element & { __etaActionHandler?: Bound };

const START_EVENTS = ["touchstart", "mousedown"] as const;
const END_EVENTS = ["touchend", "touchcancel", "mouseup", "click"] as const;

function detach(element: Bindable): void {
  const bound = element.__etaActionHandler;
  if (!bound) return;
  for (const type of START_EVENTS) {
    if (bound.start) element.removeEventListener(type, bound.start);
  }
  for (const type of END_EVENTS) {
    if (bound.end) element.removeEventListener(type, bound.end);
  }
  element.__etaActionHandler = undefined;
}

/** Announce a recognized gesture; the card maps it to the configured action. */
function emit(element: Element, action: "tap" | "hold" | "double_tap"): void {
  element.dispatchEvent(
    new CustomEvent("action", { detail: { action }, bubbles: true, composed: true }),
  );
}

function attach(element: Bindable, options: ActionHandlerOptions): void {
  detach(element);
  if (options.disabled) return;

  let holdTimer: number | undefined;
  let doubleTapTimer: number | undefined;
  let held = false;

  const start = () => {
    held = false;
    if (!options.hasHold) return;
    holdTimer = window.setTimeout(() => {
      held = true;
      emit(element, "hold");
    }, HOLD_MS);
  };

  const end = (ev: Event) => {
    if (holdTimer !== undefined) {
      clearTimeout(holdTimer);
      holdTimer = undefined;
    }
    // mouseup/touchend only ever cancel a pending hold; the tap itself is the click
    // that follows, so a touch sequence is not counted twice.
    if (ev.type !== "click") return;
    if (held) {
      held = false;
      return; // the hold already fired
    }
    if (!options.hasDoubleClick) {
      emit(element, "tap");
      return;
    }
    if (doubleTapTimer === undefined) {
      doubleTapTimer = window.setTimeout(() => {
        doubleTapTimer = undefined;
        emit(element, "tap");
      }, DOUBLE_TAP_MS);
    } else {
      clearTimeout(doubleTapTimer);
      doubleTapTimer = undefined;
      emit(element, "double_tap");
    }
  };

  for (const type of START_EVENTS) element.addEventListener(type, start, { passive: true });
  for (const type of END_EVENTS) element.addEventListener(type, end);
  element.__etaActionHandler = { options, start, end };
}

class ActionHandlerDirective extends Directive {
  private _element?: Bindable;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error("actionHandler must be bound to an element, e.g. <g ${actionHandler()}>");
    }
  }

  public update(part: Part, props: unknown[]) {
    const element = (part as ElementPart).element as Bindable;
    const opts = (props[0] ?? {}) as ActionHandlerOptions;
    const current = element.__etaActionHandler?.options;
    if (
      this._element !== element ||
      current?.hasHold !== opts.hasHold ||
      current?.hasDoubleClick !== opts.hasDoubleClick ||
      current?.disabled !== opts.disabled
    ) {
      this._element = element;
      attach(element, opts);
    }
    return noChange;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(_options?: ActionHandlerOptions) {
    return noChange;
  }
}

export const actionHandler = directive(ActionHandlerDirective);
