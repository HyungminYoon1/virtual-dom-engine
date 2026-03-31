/*
 * Responsibility:
 * - 루트 컴포넌트의 update 실행 시점을 제어한다.
 * - sync / microtask batching 전략을 모두 지원한다.
 *
 * Easy explanation:
 * - setState가 호출됐다고 항상 즉시 다시 그릴 필요는 없다.
 * - 여러 setState를 한 번의 렌더로 합칠 수도 있고, 바로 처리할 수도 있다.
 * - 이 파일은 "언제 update를 실제로 실행할지"를 결정한다.
 */

function flushScheduledUpdate(component, token) {
  if (component.scheduledUpdate !== token) {
    return;
  }

  if (token.cancelled || !component.isMounted) {
    component.scheduledUpdate = null;
    return;
  }

  component.scheduledUpdate = null;
  component.update();
}

export function scheduleUpdate(component) {
  if (!component.isMounted) {
    return;
  }

  if (component.batching === "microtask") {
    if (component.scheduledUpdate && !component.scheduledUpdate.cancelled) {
      return;
    }

    const token = { cancelled: false };
    component.scheduledUpdate = token;

    queueMicrotask(() => {
      flushScheduledUpdate(component, token);
    });

    return;
  }

  component.update();
}

export function cancelScheduledUpdate(component) {
  if (!component.scheduledUpdate) {
    return;
  }

  component.scheduledUpdate.cancelled = true;
  component.scheduledUpdate = null;
}
