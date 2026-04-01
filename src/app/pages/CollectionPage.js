/*
 * Responsibility:
 * - 카드 검색, 필터, 정렬, 선택, 즐겨찾기 토글을 담당하는 컬렉션 페이지를 렌더링한다.
 */

import { h } from "../../index.js";
import { PageHeader } from "../components/PageHeader.js";
import { CollectionToolbar } from "../components/CollectionToolbar.js";
import { CardTile } from "../components/CardTile.js";

function renderCards(props) {
  if (props.cards.length === 0) {
    return [h("p", { id: "collection-empty-state", className: "empty-state" }, props.emptyMessage)];
  }

  return props.cards.map((card) =>
    h(CardTile, {
      key: card.id,
      card,
      isSelected: props.selectedCardId === card.id,
      typeLabels: props.typeLabels,
      copy: props.copy,
      tiltEnabled: props.settings.tiltEnabled,
      glareEnabled: props.settings.glareEnabled,
      highResImage: props.settings.highResImage,
      onSelect: props.onSelectCard,
      onToggleFavorite: props.onToggleFavorite,
      onOpenClick: props.onOpenCardClick,
      onFavoriteClick: props.onFavoriteCardClick,
      onPointerMove: props.onPointerMove,
      onPointerLeave: props.onPointerLeave,
    })
  );
}

export function CollectionPage(props) {
  const rowHeight = props.rowHeight ?? 430;
  const contentHeight = props.contentHeight ?? rowHeight;
  const windowOffset = props.windowOffset ?? 0;

  return h("section", { id: "page-collection", className: "page-stack" },
    h(PageHeader, {
      kicker: props.copy.collection.kicker,
      title: props.copy.collection.title,
      description: props.copy.collection.description,
      actions: [
        {
          id: "collection-go-detail",
          label: props.copy.collection.viewDetail,
          onClick: () => props.onNavigate("detail"),
          tone: "ghost",
        },
      ],
    }),
    h(CollectionToolbar, {
      visibleCount: props.visibleCount,
      renderedCount: props.renderedCount,
      totalCount: props.totalCount,
      searchKeyword: props.searchKeyword,
      typeFilter: props.typeFilter,
      favoritesOnly: props.favoritesOnly,
      sortMode: props.sortMode,
      typeLabels: props.typeLabels,
      copy: props.copy,
      onSearchInput: props.onSearchInput,
      onTypeFilterChange: props.onTypeFilterChange,
      onFavoritesToggle: props.onFavoritesToggle,
      onSortChange: props.onSortChange,
    }),
    props.visibleCount === 0
      ? h("section", { id: "collection-card-grid", className: "card-grid" }, ...renderCards(props))
      : h("section", {
        id: "collection-scroll-area",
        className: "collection-scroll-area",
        onScroll: props.onViewportScroll,
      },
      h("div", {
        className: "collection-virtual-canvas",
        style: `height: ${contentHeight}px;`,
      },
      h("div", {
        className: "collection-virtual-window",
        style: `transform: translateY(${windowOffset}px);`,
      },
      h("section", {
        id: "collection-card-grid",
        className: "card-grid collection-virtual-grid",
        style: `--collection-columns: ${props.cardsPerRow}; --collection-row-height: ${rowHeight}px;`,
      }, ...renderCards(props)))))
  );
}
