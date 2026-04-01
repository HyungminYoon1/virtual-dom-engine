/*
 * Responsibility:
 * - 컬렉션 페이지의 검색, 필터, 정렬 컨트롤을 렌더링한다.
 */

import { h } from "../../index.js";

function renderTypeOptions(typeLabels, allLabel) {
  return [
    h("option", { key: "all", value: "all" }, allLabel),
    ...Object.entries(typeLabels).map(([value, label]) =>
      h("option", { key: value, value }, label)
    ),
  ];
}

function renderSortOptions(sortOptions) {
  return [
    h("option", { key: "number", value: "number" }, sortOptions.number),
    h("option", { key: "name", value: "name" }, sortOptions.name),
    h("option", { key: "favorites", value: "favorites" }, sortOptions.favorites),
  ];
}

export function CollectionToolbar(props) {
  return h("section", { className: "panel-card toolbar-card" },
    h("div", { className: "panel-heading" },
      h("h2", null, props.copy.toolbar.title),
      h("p", {
        id: "collection-result-count",
      }, props.copy.toolbar.resultSummary(props.visibleCount, props.renderedCount, props.totalCount))
    ),
    h("div", { className: "toolbar-grid" },
      h("label", { className: "field" },
        h("span", { className: "field-label" }, props.copy.toolbar.search),
        h("input", {
          id: "collection-search-input",
          value: props.searchKeyword,
          onInput: props.onSearchInput,
          placeholder: props.copy.toolbar.searchPlaceholder,
        })
      ),
      h("label", { className: "field" },
        h("span", { className: "field-label" }, props.copy.toolbar.type),
        h("select", {
          id: "collection-type-filter",
          value: props.typeFilter,
          onChange: props.onTypeFilterChange,
        }, ...renderTypeOptions(props.typeLabels, props.copy.toolbar.allTypes))
      ),
      h("label", { className: "field" },
        h("span", { className: "field-label" }, props.copy.toolbar.sort),
        h("select", {
          id: "collection-sort-select",
          value: props.sortMode,
          onChange: props.onSortChange,
        }, ...renderSortOptions(props.copy.sortOptions))
      ),
      h("label", { className: "checkbox-field toolbar-checkbox" },
        h("input", {
          id: "collection-favorites-only",
          type: "checkbox",
          checked: props.favoritesOnly,
          onChange: props.onFavoritesToggle,
        }),
        h("span", null, props.copy.toolbar.favoritesOnly)
      )
    )
  );
}
