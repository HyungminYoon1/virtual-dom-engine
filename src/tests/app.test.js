/*
 * Responsibility:
 * - 집중 루틴 보드 앱의 핵심 사용자 흐름을 검증한다.
 */

import { createApp } from "../index.js";
import { App } from "../app/App.js";

function flushMicrotasks() {
  return Promise.resolve().then(() => Promise.resolve());
}

async function runCase(name, fn) {
  try {
    await fn();
    return { name, passed: true };
  } catch (error) {
    return { name, passed: false, error: error.message };
  }
}

function getButtonsByText(root, label) {
  return root
    .querySelectorAll("button")
    .filter((button) => button.textContent === label);
}

export async function runAppTests() {
  return Promise.all([
    runCase("focus routine board renders core sections", async () => {
      const root = document.createElement("div");
      createApp({ root, component: App, batching: "microtask" }).mount();
      await flushMicrotasks();

      if (!root.textContent.includes("집중 루틴 보드")) {
        throw new Error("Expected app title to render.");
      }

      if (!root.textContent.includes("Focus Now") || !root.textContent.includes("In Progress") || !root.textContent.includes("Done")) {
        throw new Error("Expected grouped board sections to render.");
      }
    }),
    runCase("focus routine board supports add, search and toggle flows", async () => {
      const root = document.createElement("div");
      createApp({ root, component: App, batching: "microtask" }).mount();
      await flushMicrotasks();

      const titleInput = root.querySelector("#routine-title-input");
      const searchInput = root.querySelector("#routine-search-input");
      const composerForm = root.querySelector("#routine-composer-form");

      if (!titleInput || !searchInput || !composerForm) {
        throw new Error("Expected the focus board form controls to expose stable selectors.");
      }

      titleInput.value = "발표 연습 15분";
      titleInput.dispatchEvent(new Event("input", { bubbles: true }));
      await flushMicrotasks();
      composerForm.dispatchEvent(new Event("submit", { bubbles: true }));
      await flushMicrotasks();

      if (!root.textContent.includes("발표 연습 15분")) {
        throw new Error("Expected a newly added routine to appear.");
      }

      searchInput.value = "발표";
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      await flushMicrotasks();

      if (root.querySelectorAll("article").length !== 1) {
        throw new Error("Expected search filter to narrow the visible routine list.");
      }

      const completeButtons = getButtonsByText(root, "완료");

      if (completeButtons.length === 0) {
        throw new Error("Expected at least one visible complete button after filtering.");
      }

      completeButtons[0].dispatchEvent(new Event("click", { bubbles: true }));
      await flushMicrotasks();

      if (!root.textContent.includes("완료했습니다")) {
        throw new Error("Expected insight panel action text to stay in sync after toggle.");
      }
    }),
  ]);
}
