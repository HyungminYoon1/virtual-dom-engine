/*
 * Responsibility:
 * - 렌더 단계에서 수집된 effect를 DOM 반영 이후 commit 한다.
 *
 * Easy explanation:
 * - useEffect는 렌더 도중 바로 실행되면 안 된다.
 * - 먼저 화면이 바뀌고, 그 뒤에 부수 효과를 실행해야 한다.
 * - 이 파일은 그 후반 작업만 담당한다.
 */

function resolveCleanup(result) {
  return typeof result === "function" ? result : null;
}

export function commitEffects(component) {
  const pendingIndexes = component.pendingEffects.slice();
  component.pendingEffects = [];

  for (const hookIndex of pendingIndexes) {
    const slot = component.hooks[hookIndex];

    if (!slot || slot.kind !== "effect") {
      continue;
    }

    if (typeof slot.cleanup === "function") {
      slot.cleanup();
    }

    const nextCleanup = slot.create();
    slot.cleanup = resolveCleanup(nextCleanup);
    slot.deps = slot.nextDeps;
  }
}
