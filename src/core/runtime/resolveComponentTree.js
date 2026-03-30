/*
 * Responsibility:
 * - 자식 함수형 컴포넌트를 일반 VNode 트리로 전개한다.
 */

import { createTextVNode } from "../vnode/index.js";
import { normalizeChildren } from "../vnode/normalizeChildren.js";
import { isArray, isFunction } from "../shared/utils.js";
import { runWithHooksDisabled } from "./currentDispatcher.js";

function normalizeResolvedValue(value) {
  if (value === null || value === undefined || value === false || value === true) {
    return createTextVNode("");
  }

  if (typeof value === "string" || typeof value === "number") {
    return createTextVNode(value);
  }

  if (isArray(value)) {
    throw new Error("Child components must return a single VNode.");
  }

  return value;
}

function resolveChildren(children = []) {
  return normalizeChildren(children).map((child) => resolveComponentTree(child));
}

export function resolveComponentTree(inputVNode) {
  const vnode = normalizeResolvedValue(inputVNode);

  if (vnode.type === "text") {
    return vnode;
  }

  if (!isFunction(vnode.tag)) {
    return {
      ...vnode,
      children: resolveChildren(vnode.children),
    };
  }

  const nextProps = {
    ...(vnode.props ?? {}),
    children: vnode.children ?? [],
  };

  const resolved = runWithHooksDisabled(() => vnode.tag(nextProps));

  return resolveComponentTree(resolved);
}
