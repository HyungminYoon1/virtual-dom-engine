/*
 * Responsibility:
 * - 루트 컴포넌트 종료 시 예약 작업과 effect cleanup, DOM 정리를 수행한다.
 */

import { cancelScheduledUpdate } from "./scheduleUpdate.js";
import { clearCurrentComponent, getCurrentComponent } from "./currentDispatcher.js";

function clearRootElement(rootElement) {
  if (!rootElement) {
    return;
  }

  while (rootElement.firstChild) {
    rootElement.removeChild(rootElement.firstChild);
  }
}

export function unmountComponent(component) {
  cancelScheduledUpdate(component);
  component.pendingEffects = [];

  for (const slot of component.hooks) {
    if (slot?.kind === "effect" && typeof slot.cleanup === "function") {
      slot.cleanup();
      slot.cleanup = null;
    }
  }

  clearRootElement(component.rootElement);

  if (getCurrentComponent() === component) {
    clearCurrentComponent();
  }

  component.isMounted = false;
  component.currentVNode = null;
  component.rootElement = null;
  component.engine = null;
}
