/*
 * Responsibility:
 * - engine facade의 render / patch / diff mode 변경 동작을 검증한다.
 */

import { h } from "../core/vnode/h.js";
import { createEngine } from "../core/engine/createEngine.js";

function runCase(name, fn) {
  try {
    fn();
    return { name, passed: true };
  } catch (error) {
    return { name, passed: false, error: error.message };
  }
}

export function runEngineTests() {
  if (typeof document === "undefined") {
    return [{ name: "engine tests", passed: true, skipped: true }];
  }

  return [
    runCase("engine render syncs DOM without growing history", () => {
      const root = document.createElement("div");
      const engine = createEngine({
        root,
        initialVNode: h("div", null, "A"),
      });
      const historyLengthBefore = engine.getHistory().entries.length;

      engine.render(h("div", null, "B"));

      if (root.textContent !== "B") {
        throw new Error("Expected engine render to sync DOM.");
      }

      if (engine.getHistory().entries.length !== historyLengthBefore) {
        throw new Error("Expected render not to push history.");
      }
    }),
    runCase("engine patch pushes history", () => {
      const root = document.createElement("div");
      const initialVNode = h("div", null, "A");
      const engine = createEngine({ root, initialVNode });

      engine.render(initialVNode);
      engine.patch(h("div", null, "B"));

      if (engine.getHistory().entries.length !== 2) {
        throw new Error("Expected patch to push a new history entry.");
      }
    }),
    runCase("engine inspect keeps visible patch totals separate from raw listener churn", () => {
      const root = document.createElement("div");
      const engine = createEngine({
        root,
        initialVNode: h("button", {
          onClick: () => {},
          "data-card-id": "card-025",
        }, "A"),
      });

      engine.render(h("button", {
        onClick: () => {},
        "data-card-id": "card-025",
      }, "A"));
      engine.patch(h("button", {
        onClick: () => {},
        "data-card-id": "card-026",
        className: "is-selected",
      }, "A"));

      const snapshot = engine.inspect();

      if (snapshot.lastRenderPatchCount !== 1 || snapshot.totalPatchCount !== 1) {
        throw new Error("Expected visible engine patch counts to exclude listener and data-* churn.");
      }

      if (snapshot.rawLastRenderPatchCount <= snapshot.lastRenderPatchCount) {
        throw new Error("Expected raw engine patch counts to preserve every emitted patch.");
      }
    }),
    runCase("engine setDiffMode updates active mode", () => {
      const root = document.createElement("div");
      const engine = createEngine({ root, initialVNode: h("div", null, "A") });

      engine.setDiffMode("keyed");

      if (engine.getDiffMode() !== "keyed") {
        throw new Error("Expected diff mode to change.");
      }
    }),
    runCase("engine rejects invalid diff mode", () => {
      const root = document.createElement("div");
      const engine = createEngine({ root, initialVNode: h("div", null, "A") });
      let errorMessage = "";

      try {
        engine.setDiffMode("invalid");
      } catch (error) {
        errorMessage = error.message;
      }

      if (!errorMessage.includes("Unsupported diff mode")) {
        throw new Error("Expected invalid diff mode to throw.");
      }
    }),
  ];
}
