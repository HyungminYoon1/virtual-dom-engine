/*
 * Responsibility:
 * - 카드 쇼케이스 서비스의 공통 앱 셸을 렌더링한다.
 */

import { h } from "../../index.js";
import { TopNavigation } from "./TopNavigation.js";
import { MobileTabBar } from "./MobileTabBar.js";

export function AppShell(props) {
  // AppShell은 공통 크롬 역할만 담당한다.
  // 페이지마다 바뀌는 실제 내용은 props.children으로 받기 때문에
  // Dashboard, Collection, Detail, Settings 모두 같은 셸을 재사용할 수 있다.
  return h("div", { className: "service-shell" },
    h(TopNavigation, {
      currentPage: props.currentPage,
      pages: props.pages,
      onNavigate: props.onNavigate,
    }),
    h("section", { className: "global-status-bar", id: "global-status-bar" },
      h("span", { className: "global-status-kicker" }, "Collection Runtime"),
      h("strong", { className: "global-status-message", id: "global-status-message" }, props.lastAction)
    ),
    props.catalogNotice
      // catalogNotice는 "원격 카탈로그를 못 불렀지만 앱은 동작한다"는 사실을
      // 사용자에게 알려주는 경고/안내 레이어다.
      ? h("section", { className: "runtime-notice-bar", id: "runtime-notice-bar" },
        h("span", { className: "runtime-notice-label" }, "Catalog Notice"),
        h("strong", { className: "runtime-notice-message", id: "runtime-notice-message" }, props.catalogNotice)
      )
      : null,
    h("main", { className: "service-body" }, props.children),
    h(MobileTabBar, {
      currentPage: props.currentPage,
      pages: props.pages,
      onNavigate: props.onNavigate,
    })
  );
}
