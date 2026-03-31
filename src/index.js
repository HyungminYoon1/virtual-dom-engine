/*
 * Responsibility:
 * - week5 v3 문서에서 정의한 공개 API 엔트리포인트를 제공한다.
 * - 앱이 src/core 내부 경로에 직접 의존하지 않도록 런타임 진입점을 모은다.
 *
 * Easy explanation:
 * - 이 파일은 "라이브러리의 정문"이다.
 * - 내부 구현은 runtime, vnode, reconciler, renderer 같은 여러 모듈로 나뉘어 있지만,
 *   라이브러리 사용자 입장에서는 이 파일만 보면 된다.
 * - 따라서 이 파일을 읽으면 "이 라이브러리로 무엇을 할 수 있는가"를 가장 빠르게 이해할 수 있다.
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
