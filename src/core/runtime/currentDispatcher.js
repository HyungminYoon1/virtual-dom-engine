/*
 * Responsibility:
 * - 현재 활성 루트 컴포넌트와 Hook 호출 허용 상태를 추적한다.
 * - 루트 렌더와 자식 resolver 사이에서 Hook 사용 가능 여부를 제어한다.
 *
 * Easy explanation:
 * - Hook은 아무 곳에서나 호출되면 안 된다.
 * - 지금 "루트 App 렌더 중인지", 아니면 "자식 컴포넌트 전개 중인지"를 기록하는 전역 상태가 필요하다.
 * - 이 파일이 그 역할을 한다.
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
