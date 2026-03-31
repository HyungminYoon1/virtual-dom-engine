/*
 * Responsibility:
 * - 대시보드와 상세 화면에서 사용할 KPI 카드 컴포넌트를 렌더링한다.
 */

import { h } from "../../index.js";

export function SummaryCard(props) {
  // SummaryCard는 "숫자 + 의미 + 짧은 설명" 세 요소를 반복적으로 보여주는
  // 작은 정보 단위다. 대시보드와 상세에서 같은 형태를 공유한다.
  return h("article", {
    id: props.id,
    className: props.tone ? `summary-card summary-card-${props.tone}` : "summary-card",
  },
    h("span", { className: "summary-label" }, props.label),
    h("strong", { className: "summary-value" }, props.value),
    h("p", { className: "summary-help" }, props.help)
  );
}
