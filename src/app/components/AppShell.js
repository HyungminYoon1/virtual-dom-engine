/*
 * Responsibility:
 * - 카드 컬렉션 서비스의 공통 틀을 렌더링한다.
 */

import { h } from "../../index.js";
import { TopNavigation } from "./TopNavigation.js";
import { MobileTabBar } from "./MobileTabBar.js";

function renderPatchRows(runtimeSnapshot) {
  if (!runtimeSnapshot.patchLabels || runtimeSnapshot.patchLabels.length === 0) {
    return [
      h("li", { key: "empty", className: "inspector-patch-row is-empty" }, runtimeSnapshot.emptyLabel),
    ];
  }

  return runtimeSnapshot.patchLabels.slice(0, 6).map((label, index) =>
    h("li", { key: `${label}-${index}`, className: "inspector-patch-row" }, label)
  );
}

export function AppShell(props) {
  const inspectorCard = props.inspectorCard;
  const inspectorCardName = inspectorCard ? (inspectorCard.displayName ?? inspectorCard.name) : "";
  const inspectorImageUrl = inspectorCard
    ? props.highResImage ? inspectorCard.imageUrl : inspectorCard.thumbUrl
    : null;

  const serviceBodyClassName = props.currentPage === "collection"
    ? "service-body is-collection-page"
    : "service-body";
  const inspectorClassName = props.currentPage === "collection"
    ? "runtime-inspector is-collection-inspector"
    : "runtime-inspector";

  return h("div", { className: "service-shell" },
    h(TopNavigation, {
      currentPage: props.currentPage,
      pages: props.pages,
      copy: props.copy,
      onNavigate: props.onNavigate,
    }),
    h("section", { className: "global-status-bar", id: "global-status-bar" },
      h("span", { className: "global-status-kicker" }, props.copy.appShell.statusLabel),
      h("strong", { className: "global-status-message", id: "global-status-message" }, props.lastAction)
    ),
    props.catalogNotice
      ? h("section", { className: "runtime-notice-bar", id: "runtime-notice-bar" },
        h("span", { className: "runtime-notice-label" }, props.copy.appShell.catalogNoticeLabel),
        h("strong", { className: "runtime-notice-message", id: "runtime-notice-message" }, props.catalogNotice)
      )
      : null,
    h("section", { className: serviceBodyClassName },
      h("main", { className: "service-main" }, props.children),
      h("aside", {
        className: inspectorClassName,
        id: "runtime-inspector",
        "data-empty-patch-label": props.copy.common.noPatches,
      },
        h("div", { className: "panel-heading" },
          h("h2", null, props.copy.appShell.inspectorTitle),
          h("p", null, props.copy.appShell.inspectorDescription)
        ),
        h("div", { className: "inspector-stat-grid" },
          h("div", { className: "inspector-stat-card", id: "inspector-render-count" },
            h("span", { className: "inspector-stat-label" }, props.copy.appShell.totalRenders),
            h("strong", { className: "inspector-stat-value" }, "0")
          ),
          h("div", { className: "inspector-stat-card", id: "inspector-last-patch-count" },
            h("span", { className: "inspector-stat-label" }, props.copy.appShell.lastRenderPatchCount),
            h("strong", { className: "inspector-stat-value" }, "0")
          ),
          h("div", { className: "inspector-stat-card", id: "inspector-total-patch-count" },
            h("span", { className: "inspector-stat-label" }, props.copy.appShell.totalPatchesSinceMount),
            h("strong", { className: "inspector-stat-value" }, "0")
          )
        ),
        h("article", { className: "inspector-note-card" },
          h("span", { className: "inspector-note-label" }, props.copy.appShell.lastRuntimeAction),
          h("strong", { className: "inspector-note-value", id: "inspector-last-action" }, props.lastAction),
          h("p", { className: "inspector-note-meta", id: "inspector-runtime-meta" }, props.copy.appShell.runtimeMeta("bootstrap", "auto"))
        ),
        h("article", { className: "inspector-patch-card" },
          h("div", { className: "panel-heading" },
            h("h2", null, props.copy.appShell.changedPatchTypes),
            h("p", null, props.copy.appShell.changedPatchDescription)
          ),
          h("ul", { className: "inspector-patch-list", id: "runtime-inspector-patches" }, ...renderPatchRows({
            patchLabels: [],
            emptyLabel: props.copy.common.noPatches,
          }))
        ),
        inspectorCard
          ? h("article", {
            className: "inspector-probe-card",
            id: "runtime-inspector-probe",
            "data-patch-highlight-root": "true",
          },
            h("div", { className: "panel-heading" },
              h("h2", null, props.copy.appShell.liveImageProbe),
              h("p", null, props.copy.appShell.liveImageProbeDescription)
            ),
            h("img", {
              id: "runtime-inspector-probe-image",
              className: "inspector-probe-image",
              src: inspectorImageUrl,
              alt: `${inspectorCardName} runtime probe artwork`,
            }),
            h("div", { className: "inspector-probe-copy" },
              h("strong", { className: "inspector-probe-title" }, inspectorCardName),
              h("span", { className: "inspector-probe-caption" }, props.highResImage ? props.copy.appShell.officialArtworkSource : props.copy.appShell.spriteThumbnailSource)
            )
          )
          : null
      )
    ),
    h(MobileTabBar, {
      currentPage: props.currentPage,
      pages: props.pages,
      copy: props.copy,
      onNavigate: props.onNavigate,
    })
  );
}
