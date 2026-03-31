/*
 * Responsibility:
 * - 브라우저에서 v3 라이브러리를 실제로 부트스트랩하는 최소 데모 엔트리포인트를 제공한다.
 *
 * Note:
 * - 현재 단계의 목적은 문서에서 정의한 bootstrap 계약을 실제 파일로 맞추는 것이다.
 * - 이 파일은 최종 시연용 "집중 루틴 보드" 구현 전까지 동작 검증용 최소 데모 역할을 한다.
 */

import { createApp, h, useEffect, useMemo, useState } from "../index.js";

function FocusRoutineBootstrapDemo() {
  const [draft, setDraft] = useState("알고리즘 문제 풀기");
  const [done, setDone] = useState(false);

  const statusText = useMemo(() => (done ? "완료" : "진행 중"), [done]);

  useEffect(() => {
    document.title = `Focus Routine: ${statusText}`;

    return () => {
      document.title = "Week5 React-like Runtime";
    };
  }, [statusText]);

  return h("main", { className: "app-shell" },
    h("section", { className: "hero" },
      h("p", { className: "eyebrow" }, "Week5 React-like Demo"),
      h("h1", null, "집중 루틴 보드"),
      h("p", { className: "intro" }, "최종 시연용 앱을 만들기 전, 현재 런타임이 브라우저에서 정상 동작하는지 확인하는 최소 부트스트랩 화면입니다.")
    ),
    h("section", { className: "panel" },
      h("label", { className: "field-label" }, "오늘의 루틴"),
      h("input", {
        value: draft,
        onInput: (event) => setDraft(event.target.value),
      }),
      h("button", {
        className: done ? "secondary-button" : "primary-button",
        onClick: () => setDone((prev) => !prev),
      }, done ? "다시 시작" : "완료 처리"),
      h("p", { className: "status-line" }, `상태: ${statusText}`),
      h("p", { className: "status-line" }, `루틴: ${draft}`)
    )
  );
}

function mountDemo() {
  const root = document.getElementById("app");

  if (!root) {
    throw new Error('Expected "#app" root element for the week5 demo.');
  }

  createApp({
    root,
    component: FocusRoutineBootstrapDemo,
    batching: "microtask",
  }).mount();
}

if (document.readyState === "interactive" || document.readyState === "complete") {
  mountDemo();
} else {
  document.addEventListener("DOMContentLoaded", mountDemo, { once: true });
}
