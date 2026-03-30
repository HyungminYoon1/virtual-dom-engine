/*
 * Responsibility:
 * - Hook이 루트 렌더 본문에서만 사용되도록 강제한다.
 */

import { areHooksAllowed } from "./currentDispatcher.js";

export function assertRootOnlyHookUsage() {
  if (!areHooksAllowed()) {
    throw new Error("Hooks are only supported in the root component render.");
  }
}
