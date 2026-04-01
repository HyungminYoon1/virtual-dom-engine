/*
 * Responsibility:
 * - 데스크톱용 상단 내비게이션을 렌더링한다.
 */

import { h } from "../../index.js";

function renderButtons(currentPage, pages, onNavigate) {
  // 페이지 메타 정보만 받아 버튼을 만들기 때문에,
  // 네비게이션도 완전히 stateless하게 유지된다.
  return Object.entries(pages).map(([page, meta]) =>
    h("button", {
      id: `nav-${page}`,
      key: page,
      className: currentPage === page ? "nav-button is-active" : "nav-button",
      onClick: () => onNavigate(page),
    }, meta.label)
  );
}

export function TopNavigation(props) {
  const currentMeta = props.pages[props.currentPage];

  // 현재 페이지 라벨을 브랜드 영역에 함께 노출해
  // 사용자가 지금 어느 화면에 있는지 즉시 알 수 있게 한다.
  return h("header", { className: "top-nav" },
    h("div", { className: "brand-block" },
      h("p", { className: "brand-eyebrow" }, props.copy.brand.eyebrow),
      h("strong", { className: "brand-title" }, props.copy.brand.title),
      h("span", { className: "brand-page", id: "brand-page-label" }, currentMeta.label)
    ),
    h("nav", { className: "nav-row" }, ...renderButtons(props.currentPage, props.pages, props.onNavigate))
  );
}
