/*
 * Responsibility:
 * - 하단 인사이트 영역을 렌더링한다.
 * - 루트 상태 변화가 카드 외 영역에도 동시에 반영된다는 점을 보여준다.
 */

import { h } from "../../index.js";

function renderCategorySummary(items) {
  if (items.length === 0) {
    return [h("p", { className: "insight-empty" }, "현재 보이는 루틴이 없습니다.")];
  }

  return items.map((item) =>
    h("li", { key: item.category }, `${item.label}: ${item.count}개`)
  );
}

export function InsightPanel(props) {
  return h("section", { className: "insight-panel" },
    h("div", { className: "panel-heading" },
      h("h2", null, "오늘의 인사이트"),
      h("p", null, "상태 변화가 리스트 외 컴포넌트에도 어떻게 퍼지는지 보여주는 영역입니다.")
    ),
    h("div", { className: "insight-grid" },
      h("div", { className: "insight-card" },
        h("span", { className: "insight-label" }, "최근 액션"),
        h("strong", { className: "insight-value" }, props.lastAction)
      ),
      h("div", { className: "insight-card" },
        h("span", { className: "insight-label" }, "현재 보이는 루틴"),
        h("strong", { className: "insight-value" }, `${props.visibleCount} / ${props.totalCount}`)
      ),
      h("div", { className: "insight-card" },
        h("span", { className: "insight-label" }, "완료율"),
        h("strong", { className: "insight-value" }, props.totalCount === 0 ? "0%" : `${Math.round((props.doneCount / props.totalCount) * 100)}%`)
      )
    ),
    h("div", { className: "category-summary" },
      h("h3", null, "현재 화면 기준 카테고리 요약"),
      h("ul", null, ...renderCategorySummary(props.categorySummary))
    )
  );
}
