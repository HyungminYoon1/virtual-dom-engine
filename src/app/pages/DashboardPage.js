/*
 * Responsibility:
 * - 카드 쇼케이스 서비스의 요약 대시보드를 렌더링한다.
 */

import { h } from "../../index.js";
import { PageHeader } from "../components/PageHeader.js";
import { SummaryCard } from "../components/SummaryCard.js";
import { CardTile } from "../components/CardTile.js";

function renderTypeSummary(items, emptyLabel) {
  if (items.length === 0) {
    return [h("li", { key: "empty" }, emptyLabel)];
  }

  return items.map((item) =>
    h("li", { key: item.type }, `${item.label} · ${item.count}`)
  );
}

export function DashboardPage(props) {
  return h("section", { id: "page-dashboard", className: "page-stack" },
    h(PageHeader, {
      kicker: props.copy.dashboard.kicker,
      title: props.copy.dashboard.title,
      description: props.copy.dashboard.description,
      actions: [
        {
          id: "dashboard-go-collection",
          label: props.copy.dashboard.openCollection,
          onClick: () => props.onNavigate("collection"),
        },
      ],
    }),
    h("section", { className: "dashboard-grid" },
      h(SummaryCard, {
        id: "summary-total-cards",
        label: props.copy.dashboard.totalCards,
        value: String(props.totalCount),
        help: props.copy.dashboard.totalCardsHelp,
        tone: "warm",
      }),
      h(SummaryCard, {
        id: "summary-favorite-cards",
        label: props.copy.dashboard.savedCards,
        value: String(props.favoriteCount),
        help: props.copy.dashboard.savedCardsHelp,
        tone: "success",
      }),
      h(SummaryCard, {
        id: "summary-visible-cards",
        label: props.copy.dashboard.visibleCards,
        value: String(props.visibleCount),
        help: props.copy.dashboard.visibleCardsHelp,
      }),
      h(SummaryCard, {
        id: "summary-selected-card",
        label: props.copy.dashboard.selectedCard,
        value: props.selectedCard ? (props.selectedCard.displayName ?? props.selectedCard.name) : props.copy.common.none,
        help: props.copy.dashboard.selectedCardHelp,
      })
    ),
    h("section", { className: "dashboard-two-column" },
      h("article", { className: "panel-card spotlight-panel" },
        h("div", { className: "panel-heading" },
          h("h2", null, props.copy.dashboard.spotlightTitle),
          h("p", null, props.copy.dashboard.spotlightDescription)
        ),
        props.spotlightCard
          ? h(CardTile, {
            card: props.spotlightCard,
            isSelected: props.selectedCard?.id === props.spotlightCard.id,
            typeLabels: props.typeLabels,
            copy: props.copy,
            tiltEnabled: props.settings.tiltEnabled,
            glareEnabled: props.settings.glareEnabled,
            highResImage: props.settings.highResImage,
            onSelect: props.onSelectCard,
            onToggleFavorite: props.onToggleFavorite,
            onPointerMove: props.onPointerMove,
            onPointerLeave: props.onPointerLeave,
            tileId: "dashboard-spotlight-card",
            openId: "dashboard-spotlight-open",
            favoriteId: "dashboard-spotlight-favorite",
          })
          : h("p", { className: "empty-state" }, props.copy.dashboard.noSpotlight)
      ),
      h("div", { className: "dashboard-stack" },
        h("article", { className: "panel-card activity-panel" },
          h("div", { className: "panel-heading" },
            h("h2", null, props.copy.dashboard.latestRuntimeAction),
            h("p", null, props.copy.dashboard.latestRuntimeDescription)
          ),
          h("div", { className: "activity-callout" },
            h("strong", { id: "dashboard-last-action", className: "activity-title" }, props.lastAction),
            h("p", { className: "activity-description", id: "dashboard-top-type" }, props.topTypeMessage)
          )
        ),
        h("article", { className: "panel-card" },
          h("div", { className: "panel-heading" },
            h("h2", null, props.copy.dashboard.typeBreakdown),
            h("p", null, props.copy.dashboard.typeBreakdownDescription)
          ),
          h("ul", { id: "dashboard-type-summary", className: "insight-list" }, ...renderTypeSummary(props.typeSummary, props.copy.dashboard.noTypeData))
        )
      )
    )
  );
}
