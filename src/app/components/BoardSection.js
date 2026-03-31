/*
 * Responsibility:
 * - 특정 그룹의 루틴 카드 목록을 렌더링한다.
 */

import { h } from "../../index.js";
import { RoutineCard } from "./RoutineCard.js";

function renderItems(props) {
  if (props.items.length === 0) {
    return [
      h("p", { className: "empty-state" }, props.emptyMessage),
    ];
  }

  return props.items.map((routine, index) =>
    h(RoutineCard, {
      key: routine.id,
      sequence: index,
      routine,
      categoryLabels: props.categoryLabels,
      priorityLabels: props.priorityLabels,
      onToggle: props.onToggle,
      onRemove: props.onRemove,
    })
  );
}

export function BoardSection(props) {
  return h("section", { className: "board-section" },
    h("div", { className: "board-section-header" },
      h("div", { className: "board-heading-row" },
        h("h2", null, props.title),
        h("span", { className: "section-count-badge" }, `${props.count}개`)
      ),
      h("p", null, props.description)
    ),
    h("div", { className: "card-grid" }, ...renderItems(props))
  );
}
