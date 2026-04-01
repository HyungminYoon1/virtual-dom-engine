/*
 * Responsibility:
 * - demo와 디버깅용 inspect 데이터를 만든다.
 */

function describePatch(patch) {
  if (!patch || typeof patch !== "object") {
    return "UNKNOWN_PATCH";
  }

  if (patch.type === "SET_PROP" || patch.type === "REMOVE_PROP") {
    return `${patch.type}: ${patch.name}`;
  }

  if (patch.type === "SET_EVENT" || patch.type === "REMOVE_EVENT") {
    return `${patch.type}: ${patch.name}`;
  }

  return patch.type;
}

function isDisplayPatch(patch) {
  if (!patch || typeof patch !== "object") {
    return false;
  }

  if (patch.type === "SET_EVENT" || patch.type === "REMOVE_EVENT") {
    return false;
  }

  if ((patch.type === "SET_PROP" || patch.type === "REMOVE_PROP") && typeof patch.name === "string" && patch.name.startsWith("data-")) {
    return false;
  }

  return true;
}

export function inspectEngine(engineState) {
  const lastPatches = engineState.lastPatches ?? [];
  const rawLastRenderPatchCount = lastPatches.length;
  const lastRenderPatchCount = lastPatches.filter(isDisplayPatch).length;

  return {
    currentVNode: engineState.currentVNode,
    history: engineState.history,
    diffMode: engineState.diffMode,
    patchCount: lastRenderPatchCount,
    lastRenderPatchCount,
    rawLastRenderPatchCount,
    totalPatchCount: engineState.totalPatchCount ?? lastRenderPatchCount,
    rawTotalPatchCount: engineState.rawTotalPatchCount ?? rawLastRenderPatchCount,
    patchLabels: lastPatches.map(describePatch),
    lastPatches,
  };
}
