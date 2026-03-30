/*
 * Responsibility:
 * - week5 v3 문서에서 정의한 공개 API 엔트리포인트를 제공한다.
 * - 앱이 src/core 내부 경로에 직접 의존하지 않도록 런타임 진입점을 모은다.
 */

export { FunctionComponent } from "./core/runtime/FunctionComponent.js";
export { createApp } from "./core/runtime/createApp.js";
export { h } from "./core/vnode/h.js";
export { useState } from "./core/runtime/hooks/useState.js";
export { useEffect } from "./core/runtime/hooks/useEffect.js";
export { useMemo } from "./core/runtime/hooks/useMemo.js";

export { createEngine } from "./core/engine/createEngine.js";
export { diff } from "./core/reconciler/diff.js";
export { applyPatches } from "./core/renderer-dom/patch.js";
