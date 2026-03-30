/*
 * Responsibility:
 * - Hook 호출 시 활성 루트 컴포넌트가 있는지 검증한다.
 */

import { getCurrentComponent } from "./currentDispatcher.js";

export function assertActiveDispatcher() {
  const component = getCurrentComponent();

  if (!component) {
    throw new Error("Hooks can only be called during the root component render.");
  }

  return component;
}
