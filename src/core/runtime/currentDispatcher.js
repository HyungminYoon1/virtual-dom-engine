/*
 * Responsibility:
 * - 현재 활성 루트 컴포넌트와 Hook 호출 허용 상태를 추적한다.
 * - 루트 렌더와 자식 resolver 사이에서 Hook 사용 가능 여부를 제어한다.
 */

const dispatcherState = {
  component: null,
  allowHooks: false,
};

export function setCurrentComponent(component, options = {}) {
  dispatcherState.component = component;
  dispatcherState.allowHooks = options.allowHooks ?? true;
}

export function getCurrentComponent() {
  return dispatcherState.component;
}

export function areHooksAllowed() {
  return dispatcherState.allowHooks;
}

export function clearCurrentComponent() {
  dispatcherState.component = null;
  dispatcherState.allowHooks = false;
}

export function runWithHooksAllowed(callback) {
  const previous = { ...dispatcherState };
  dispatcherState.allowHooks = true;

  try {
    return callback();
  } finally {
    dispatcherState.component = previous.component;
    dispatcherState.allowHooks = previous.allowHooks;
  }
}

export function runWithHooksDisabled(callback) {
  const previous = { ...dispatcherState };
  dispatcherState.allowHooks = false;

  try {
    return callback();
  } finally {
    dispatcherState.component = previous.component;
    dispatcherState.allowHooks = previous.allowHooks;
  }
}
