/*
 * Responsibility:
 * - v3 공개 진입점 createApp()을 제공한다.
 */

import { FunctionComponent } from "./FunctionComponent.js";

function normalizeRoot(root) {
  if (!(root instanceof Element)) {
    throw new Error("createApp requires a valid root Element.");
  }

  return root;
}

function normalizeBatching(batching) {
  return batching ?? "sync";
}

export function createApp(options = {}) {
  const root = normalizeRoot(options.root);
  const component = options.component;

  if (typeof component !== "function") {
    throw new Error("createApp requires a root component function.");
  }

  const initialProps = options.props ?? {};
  const instance = new FunctionComponent(component, {
    name: component.name ?? "App",
    batching: normalizeBatching(options.batching),
    diffMode: options.diffMode ?? "auto",
    historyLimit: options.historyLimit ?? null,
  });

  return {
    mount() {
      return instance.mount({ root, props: initialProps });
    },

    unmount() {
      return instance.unmount();
    },

    updateProps(nextProps) {
      if (!instance.isMounted) {
        throw new Error("updateProps requires the app to be mounted first.");
      }

      return instance.update(nextProps ?? {});
    },

    getComponent() {
      return instance;
    },

    inspect() {
      const engineSnapshot = instance.engine?.inspect?.() ?? {
        currentVNode: instance.currentVNode,
        lastPatches: instance.lastPatches,
      };

      return {
        hooks: instance.hooks,
        currentVNode: instance.currentVNode,
        lastPatches: instance.lastPatches,
        renderCount: instance.renderCount,
        engine: engineSnapshot,
      };
    },
  };
}
