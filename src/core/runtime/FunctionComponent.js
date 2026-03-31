/*
 * Responsibility:
 * - 루트 함수형 컴포넌트의 mount/update/unmount와 Hook 런타임을 관리한다.
 *
 * Easy explanation:
 * - 이 클래스는 v3 런타임의 중심이다.
 * - App 함수를 그냥 한 번 호출하는 데서 끝나지 않고,
 *   이전 상태를 기억하고, 다시 렌더링하고, effect를 실행하고, 종료 시 정리까지 담당한다.
 * - React를 전혀 몰라도, "상태를 가진 루트 화면 관리자"라고 이해하면 된다.
 */

import { createEngine } from "../engine/createEngine.js";
import { setCurrentComponent, clearCurrentComponent } from "./currentDispatcher.js";
import { resolveComponentTree } from "./resolveComponentTree.js";
import { commitEffects } from "./commitEffects.js";
import { unmountComponent } from "./unmountComponent.js";

function ensureRootElement(root) {
  if (!(root instanceof Element)) {
    throw new Error("FunctionComponent.mount requires a valid root Element.");
  }
}

function normalizeProps(props) {
  return props ?? {};
}

export class FunctionComponent {
  constructor(renderFn, options = {}) {
    if (typeof renderFn !== "function") {
      throw new Error("FunctionComponent requires a render function.");
    }

    this.renderFn = renderFn;
    this.name = options.name ?? renderFn.name ?? "FunctionComponent";
    this.batching = options.batching ?? "sync";
    this.diffMode = options.diffMode ?? "auto";
    this.historyLimit = options.historyLimit ?? null;

    // hooks:
    // - useState / useEffect / useMemo가 사용하는 내부 저장소다.
    // - "첫 번째 Hook", "두 번째 Hook"처럼 호출 순서대로 슬롯을 가진다.
    this.hooks = [];
    // hookCursor:
    // - 현재 렌더 중 몇 번째 Hook을 읽고 있는지 가리킨다.
    this.hookCursor = 0;
    this.currentProps = {};
    this.currentVNode = null;
    this.rootElement = null;
    this.isMounted = false;
    // pendingEffects:
    // - 렌더 도중 "이번 commit 뒤에 실행해야 할 effect" 인덱스를 모아두는 배열이다.
    this.pendingEffects = [];
    this.renderCount = 0;
    this.lastPatches = [];
    this.scheduledUpdate = null;
    this.engine = null;
    this.hasMountedOnce = false;
    // expectedHookCount:
    // - 첫 렌더에서 관측한 Hook 개수를 기억한다.
    // - 이후 렌더에서 Hook 개수가 달라지면 규칙 위반으로 본다.
    this.expectedHookCount = null;
  }

  performRender(props = this.currentProps) {
    // 렌더를 시작할 때마다 현재 props를 확정하고,
    // Hook을 처음부터 다시 읽기 위해 cursor를 0으로 되돌린다.
    this.currentProps = normalizeProps(props);
    this.hookCursor = 0;
    this.pendingEffects = [];
    this.renderCount += 1;

    setCurrentComponent(this, { allowHooks: true });

    try {
      // 1. 루트 App 함수를 실행해 VNode 트리를 만든다.
      const unresolvedVNode = this.renderFn(this.currentProps);
      // 2. 자식 함수형 컴포넌트를 모두 실제 VNode로 전개한다.
      const resolvedVNode = resolveComponentTree(unresolvedVNode);

      if (this.expectedHookCount === null) {
        // 첫 렌더에서는 Hook 개수를 기준선으로 저장한다.
        this.expectedHookCount = this.hookCursor;
      } else if (this.hookCursor !== this.expectedHookCount) {
        throw new Error("Hook count changed between renders.");
      }

      return resolvedVNode;
    } finally {
      clearCurrentComponent();
    }
  }

  mount({ root, props } = {}) {
    ensureRootElement(root);

    if (this.isMounted) {
      return this.currentVNode;
    }

    // 같은 인스턴스는 문서 기준상 한 번만 mount 할 수 있다.
    if (this.hasMountedOnce) {
      throw new Error("FunctionComponent instances cannot be mounted again after unmount.");
    }

    this.rootElement = root;
    const nextVNode = this.performRender(props);

    // createEngine은 실제 diff/patch와 DOM 반영을 맡는 저수준 엔진이다.
    // FunctionComponent는 그 위에 Hook과 렌더 생명주기를 얹는다.
    this.engine = createEngine({
      root,
      initialVNode: nextVNode,
      diffMode: this.diffMode,
      historyLimit: this.historyLimit,
    });

    // 최초 mount는 diff 없이 DOM을 한 번에 만든다.
    this.engine.render(nextVNode);
    this.currentVNode = nextVNode;
    this.lastPatches = [];
    this.isMounted = true;
    this.hasMountedOnce = true;

    // 화면이 실제로 반영된 뒤에만 effect를 실행해야 하므로 마지막에 commit한다.
    commitEffects(this);

    return nextVNode;
  }

  update(nextProps) {
    if (!this.isMounted || !this.engine) {
      throw new Error("FunctionComponent.update requires a mounted component.");
    }

    if (arguments.length > 0) {
      // 문서 계약상 nextProps는 merge가 아니라 "완전 교체"다.
      this.currentProps = normalizeProps(nextProps);
    }

    // update는 새 VNode를 만들고, 이전 VNode와 비교해 필요한 DOM만 바꾼다.
    const nextVNode = this.performRender(this.currentProps);
    const result = this.engine.patch(nextVNode);

    this.currentVNode = nextVNode;
    this.lastPatches = result.patches;

    commitEffects(this);

    return {
      vnode: nextVNode,
      patches: result.patches,
    };
  }

  unmount() {
    if (!this.isMounted) {
      return;
    }

    // 실제 cleanup 로직은 별도 모듈로 분리해 책임을 단순하게 유지한다.
    unmountComponent(this);
  }
}
