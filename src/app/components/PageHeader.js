/*
 * Responsibility:
 * - 각 페이지 상단의 제목, 설명, 보조 액션을 공통 형식으로 렌더링한다.
 */

import { h } from "../../index.js";

function renderActions(actions = []) {
  // 페이지 헤더의 버튼은 "구조는 공통, 동작은 페이지별"인 전형적인 재사용 지점이다.
  return actions.map((action) =>
    h("button", {
      id: action.id,
      key: action.id,
      className: action.tone === "ghost" ? "ghost-button" : "secondary-button",
      onClick: action.onClick,
    }, action.label)
  );
}

export function PageHeader(props) {
  // kicker/title/description/actions를 표준화해 두면
  // 페이지가 달라져도 같은 시각 리듬으로 읽히는 장점이 있다.
  return h("section", { className: "page-header-card" },
    h("div", { className: "page-header-copy" },
      h("p", { className: "page-kicker" }, props.kicker),
      h("h1", { className: "page-title" }, props.title),
      h("p", { className: "page-description" }, props.description)
    ),
    props.actions && props.actions.length > 0
      ? h("div", { className: "page-header-actions" }, ...renderActions(props.actions))
      : h("div", { className: "page-header-actions page-header-actions-empty" })
  );
}
