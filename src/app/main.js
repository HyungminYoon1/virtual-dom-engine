/*
 * Responsibility:
 * - 브라우저에서 카드 컬렉션 쇼케이스 앱을 실제로 부트스트랩한다.
 */

import { createApp } from "../index.js";
import { App } from "./App.js";

function mountApp() {
  // 문서 계약상 브라우저 데모는 반드시 #app 하나에만 mount 되어야 한다.
  const root = document.getElementById("app");

  if (!root) {
    throw new Error('Expected "#app" root element for the card collection showcase app.');
  }

  createApp({
    root,
    component: App,
    // microtask batching을 사용하면 같은 tick 안의 여러 업데이트를 묶어
    // 불필요한 중복 렌더를 줄일 수 있다.
    batching: "microtask",
  }).mount();
}

if (document.readyState === "interactive" || document.readyState === "complete") {
  // HTML이 이미 준비된 상태면 즉시 부트스트랩할 수 있다.
  mountApp();
} else {
  // 아직 문서가 덜 로드된 경우에는 DOMContentLoaded 이후 안전하게 시작한다.
  document.addEventListener("DOMContentLoaded", mountApp, { once: true });
}
