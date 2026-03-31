/*
 * Responsibility:
 * - 필터, 검색, 정렬 입력을 렌더링한다.
 */

import { h } from "../../index.js";

function renderPriorityOptions(priorityLabels) {
  return [
    h("option", { value: "all", key: "all" }, "전체 중요도"),
    ...Object.entries(priorityLabels).map(([value, label]) =>
      h("option", { value, key: value }, label)
    ),
  ];
}

export function FilterBar(props) {
  return h("section", { className: "panel-card filter-card" },
    h("div", { className: "panel-heading" },
      h("h2", null, "필터와 정렬"),
      h("p", null, "useMemo로 계산한 파생 리스트를 이 영역에서 제어합니다.")
    ),
    h("div", { className: "filter-summary" },
      h("strong", { className: "filter-summary-count" }, `현재 ${props.visibleCount} / ${props.totalCount}`),
      h("div", { className: "filter-chip-list" },
        ...props.activeFilterSummary.map((item) =>
          h("span", { className: "filter-chip", key: item }, item)
        )
      )
    ),
    h("div", { className: "filter-grid" },
      h("label", { className: "field" },
        h("span", { className: "field-label" }, "상태"),
        h("select", {
          id: "routine-status-filter",
          value: props.statusFilter,
          onChange: props.onStatusFilterChange,
        },
          h("option", { value: "all" }, "전체"),
          h("option", { value: "active" }, "진행 중"),
          h("option", { value: "done" }, "완료")
        )
      ),
      h("label", { className: "field" },
        h("span", { className: "field-label" }, "중요도"),
        h("select", {
          id: "routine-priority-filter",
          value: props.priorityFilter,
          onChange: props.onPriorityFilterChange,
        }, ...renderPriorityOptions(props.priorityLabels))
      ),
      h("label", { className: "field search-field" },
        h("span", { className: "field-label" }, "검색"),
        h("input", {
          id: "routine-search-input",
          value: props.searchKeyword,
          onInput: props.onSearchInput,
          placeholder: "루틴 제목 또는 카테고리 검색",
        })
      ),
      h("label", { className: "field" },
        h("span", { className: "field-label" }, "정렬"),
        h("select", {
          id: "routine-sort-select",
          value: props.sortMode,
          onChange: props.onSortChange,
        },
          h("option", { value: "created" }, "생성순"),
          h("option", { value: "priority" }, "중요도순"),
          h("option", { value: "title" }, "이름순")
        )
      )
    )
  );
}
