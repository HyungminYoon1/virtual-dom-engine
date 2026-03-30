/*
 * Responsibility:
 * - Hook dependency 배열의 얕은 동일성을 비교한다.
 */

export function areHookDepsEqual(previousDeps, nextDeps) {
  if (!Array.isArray(previousDeps) || !Array.isArray(nextDeps)) {
    return false;
  }

  if (previousDeps.length !== nextDeps.length) {
    return false;
  }

  for (let index = 0; index < previousDeps.length; index += 1) {
    if (!Object.is(previousDeps[index], nextDeps[index])) {
      return false;
    }
  }

  return true;
}
