/*
 * Responsibility:
 * - 루틴 하나를 카드 형태로 렌더링한다.
 * - 완료 토글, 삭제 같은 직접 상호작용은 이 카드에서 발생하지만 상태는 루트가 관리한다.
 */

import { h } from "../../index.js";

function formatTime(createdAt) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

export function RoutineCard(props) {
  const categoryLabel = props.categoryLabels[props.routine.category] ?? props.routine.category;
  const priorityLabel = props.priorityLabels[props.routine.priority] ?? props.routine.priority;
  const cardClassName = props.routine.done
    ? `routine-card routine-card-${props.routine.priority} is-done`
    : `routine-card routine-card-${props.routine.priority}`;

  return h("article", {
    className: cardClassName,
    id: `routine-card-${props.routine.id}`,
    style: `animation-delay: ${Math.max(0, props.sequence ?? 0) * 20}ms`,
  },
    h("div", { className: "routine-topline" },
      h("span", { className: "badge badge-category" }, categoryLabel),
      h("span", { className: `badge badge-priority badge-priority-${props.routine.priority}` }, priorityLabel)
    ),
    h("h3", { className: "routine-title" }, props.routine.title),
    h("p", { className: "routine-caption" }, `${categoryLabel} 집중 블록 · ${priorityLabel} 우선순위`),
    h("p", { className: "routine-meta" }, `${props.routine.done ? "완료됨" : "진행 중"} · ${formatTime(props.routine.createdAt)}`),
    h("div", { className: "routine-actions" },
      h("button", {
        id: `routine-toggle-${props.routine.id}`,
        className: props.routine.done ? "secondary-button" : "primary-button",
        onClick: () => props.onToggle(props.routine.id),
      }, props.routine.done ? "다시 진행" : "완료"),
      h("button", {
        id: `routine-remove-${props.routine.id}`,
        className: "ghost-button",
        onClick: () => props.onRemove(props.routine.id),
      }, "삭제")
    )
  );
}
