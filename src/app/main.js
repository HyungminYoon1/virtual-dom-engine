/*
 * Responsibility:
 * - 브라우저에서 집중 루틴 보드 앱을 실제로 부트스트랩한다.
 * - 문서에 정의된 `#app` root 계약을 실제 코드로 구현한다.
 */

import { createApp } from "../index.js";
import { App } from "./App.js";

function mountApp() {
  const root = document.getElementById("app");

  if (!root) {
    throw new Error('Expected "#app" root element for the focus routine board app.');
  }

  createApp({
    root,
    component: App,
    batching: "microtask",
  }).mount();
}

if (document.readyState === "interactive" || document.readyState === "complete") {
  mountApp();
} else {
  document.addEventListener("DOMContentLoaded", mountApp, { once: true });
}
