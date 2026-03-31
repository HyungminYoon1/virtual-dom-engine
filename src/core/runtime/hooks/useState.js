/*
 * Responsibility:
 * - 루트 전용 state Hook을 제공한다.
 *
 * Easy explanation:
 * - useState는 변수처럼 보이지만, 실제로는 hooks 배열 안의 상태 슬롯을 읽고 쓰는 함수다.
 * - 같은 위치에서 다시 호출되면 같은 슬롯을 재사용하기 때문에 상태가 유지된다.
 */

import { isFunction } from "../../shared/utils.js";
import { assertActiveDispatcher } from "../assertActiveDispatcher.js";
import { assertRootOnlyHookUsage } from "../assertRootOnlyHookUsage.js";
import { scheduleUpdate } from "../scheduleUpdate.js";

function resolveInitialState(initialState) {
  return isFunction(initialState) ? initialState() : initialState;
}

export function useState(initialState) {
  const component = assertActiveDispatcher();
  assertRootOnlyHookUsage();

  const hookIndex = component.hookCursor;

  if (component.expectedHookCount !== null && hookIndex >= component.expectedHookCount) {
    throw new Error("Hook count changed between renders.");
  }

  let slot = component.hooks[hookIndex];

  if (!slot) {
    slot = {
      kind: "state",
      value: resolveInitialState(initialState),
      setter: null,
    };

    slot.setter = (nextState) => {
      if (!component.isMounted) {
        return;
      }

      const previousValue = slot.value;
      const resolvedValue = isFunction(nextState) ? nextState(previousValue) : nextState;

      if (Object.is(previousValue, resolvedValue)) {
        return;
      }

      slot.value = resolvedValue;
      scheduleUpdate(component);
    };

    component.hooks[hookIndex] = slot;
  }

  if (slot.kind !== "state") {
    throw new Error(`Hook order mismatch at slot ${hookIndex}. Expected useState.`);
  }

  component.hookCursor += 1;

  return [slot.value, slot.setter];
}
