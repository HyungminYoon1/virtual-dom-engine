/*
 * Responsibility:
 * - 카드 서비스의 전역 설정과 데모 초기화 옵션을 렌더링한다.
 */

import { h } from "../../index.js";
import { LANGUAGE_OPTIONS } from "../i18n/messages.js";
import { PageHeader } from "../components/PageHeader.js";

function renderPageOptions(pages) {
  return Object.entries(pages)
    .filter(([page]) => page !== "detail")
    .map(([page, meta]) => h("option", { key: page, value: page }, meta.label));
}

function renderSortOptions(sortOptions) {
  return [
    h("option", { key: "number", value: "number" }, sortOptions.number),
    h("option", { key: "name", value: "name" }, sortOptions.name),
    h("option", { key: "favorites", value: "favorites" }, sortOptions.favorites),
  ];
}

function renderLanguageOptions() {
  return LANGUAGE_OPTIONS.map((option) =>
    h("option", { key: option.value, value: option.value }, option.label)
  );
}

export function SettingsPage(props) {
  return h("section", { id: "page-settings", className: "page-stack" },
    h(PageHeader, {
      kicker: props.copy.settings.kicker,
      title: props.copy.settings.title,
      description: props.copy.settings.description,
      actions: [
        {
          id: "settings-reset-demo",
          label: props.copy.settings.resetShowcase,
          onClick: props.onResetDemo,
        },
      ],
    }),
    h("section", { className: "settings-grid" },
      h("article", { className: "panel-card" },
        h("div", { className: "panel-heading" },
          h("h2", null, props.copy.settings.defaultView),
          h("p", null, props.copy.settings.defaultViewDescription)
        ),
        h("label", { className: "field" },
          h("span", { className: "field-label" }, props.copy.settings.defaultPage),
          h("select", {
            id: "settings-default-page",
            value: props.settings.defaultPage,
            onChange: props.onDefaultPageChange,
          }, ...renderPageOptions(props.pages))
        )
      ),
      h("article", { className: "panel-card" },
        h("div", { className: "panel-heading" },
          h("h2", null, props.copy.settings.collectionSorting),
          h("p", null, props.copy.settings.collectionSortingDescription)
        ),
        h("label", { className: "field" },
          h("span", { className: "field-label" }, props.copy.settings.defaultSort),
          h("select", {
            id: "settings-default-sort",
            value: props.settings.defaultSortMode,
            onChange: props.onDefaultSortChange,
          }, ...renderSortOptions(props.copy.sortOptions))
        )
      ),
      h("article", { className: "panel-card" },
        h("div", { className: "panel-heading" },
          h("h2", null, props.copy.settings.languageTitle),
          h("p", null, props.copy.settings.languageDescription)
        ),
        h("label", { className: "field" },
          h("span", { className: "field-label" }, props.copy.settings.languageLabel),
          h("select", {
            id: "settings-language-select",
            value: props.settings.locale,
            onChange: props.onLocaleChange,
          }, ...renderLanguageOptions())
        )
      ),
      h("article", { className: "panel-card" },
        h("div", { className: "panel-heading" },
          h("h2", null, props.copy.settings.cardMotion),
          h("p", null, props.copy.settings.cardMotionDescription)
        ),
        h("label", { className: "checkbox-field" },
          h("input", {
            id: "settings-tilt-toggle",
            type: "checkbox",
            checked: props.settings.tiltEnabled,
            onChange: props.onTiltToggle,
          }),
          h("span", null, props.settings.tiltEnabled ? props.copy.settings.tiltEnabled : props.copy.settings.tiltDisabled)
        ),
        h("label", { className: "checkbox-field" },
          h("input", {
            id: "settings-glare-toggle",
            type: "checkbox",
            checked: props.settings.glareEnabled,
            onChange: props.onGlareToggle,
          }),
          h("span", null, props.settings.glareEnabled ? props.copy.settings.glareEnabled : props.copy.settings.glareDisabled)
        ),
        h("label", { className: "checkbox-field" },
          h("input", {
            id: "settings-highres-toggle",
            type: "checkbox",
            checked: props.settings.highResImage,
            onChange: props.onHighResToggle,
          }),
          h("span", null, props.settings.highResImage ? props.copy.settings.highResEnabled : props.copy.settings.highResDisabled)
        )
      )
    ),
    h("article", { className: "panel-card runtime-info-card" },
      h("div", { className: "panel-heading" },
        h("h2", null, props.copy.settings.runtimeNotes),
        h("p", null, props.copy.settings.runtimeNotesDescription)
      ),
      h("ul", { className: "insight-list" },
        ...props.copy.settings.runtimeNoteItems.map((item, index) => h("li", { key: `runtime-note-${index}` }, item))
      )
    )
  );
}
