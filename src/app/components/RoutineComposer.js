/*
 * Responsibility:
 * - 새 루틴을 입력하고 추가하는 폼을 렌더링한다.
 */

import { h } from "../../index.js";

function renderCategoryOptions(categoryLabels) {
  return Object.entries(categoryLabels).map(([value, label]) =>
    h("option", { value, key: value }, label)
  );
}

function renderPriorityOptions(priorityLabels) {
  return Object.entries(priorityLabels).map(([value, label]) =>
    h("option", { value, key: value }, label)
  );
}

export function RoutineComposer(props) {
  return h("section", { className: "panel-card" },
    h("div", { className: "panel-heading" },
      h("h2", null, "루틴 추가"),
      h("p", null, "오늘의 집중 흐름에 맞는 새 루틴을 즉시 추가합니다.")
    ),
    h("form", {
      id: "routine-composer-form",
      className: "composer-form",
      onSubmit: props.onSubmit,
    },
      h("label", { className: "field" },
        h("span", { className: "field-label" }, "루틴 제목"),
        h("input", {
          id: "routine-title-input",
          value: props.draftTitle,
          onInput: props.onTitleInput,
          placeholder: "예: 기술 면접 질문 5개 정리하기",
        })
      ),
      h("div", { className: "field-row" },
        h("label", { className: "field" },
          h("span", { className: "field-label" }, "카테고리"),
          h("select", {
            value: props.draftCategory,
            onChange: props.onCategoryChange,
          }, ...renderCategoryOptions(props.categoryLabels))
        ),
        h("label", { className: "field" },
          h("span", { className: "field-label" }, "중요도"),
          h("select", {
            value: props.draftPriority,
            onChange: props.onPriorityChange,
          }, ...renderPriorityOptions(props.priorityLabels))
        )
      ),
      h("button", { className: "primary-button", type: "submit" }, "루틴 추가")
    )
  );
}
