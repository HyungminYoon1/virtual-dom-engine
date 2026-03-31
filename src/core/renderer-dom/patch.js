/*
 * Responsibility:
 * - flat patch list를 실제 DOM에 적용한다.
 * - path 기반 대상 탐색, DOM 교체/이동/속성 반영을 담당한다.
 *
 * Easy explanation:
 * - diff가 계산한 patch 목록을 실제 DOM 조작으로 옮기는 마지막 단계다.
 * - 즉, "무엇을 바꿀까"가 diff라면, "실제로 바꾸기"는 patch다.
 */

import { PATCH_TYPES } from "../reconciler/patchTypes.js";
import { createDomFromVNode } from "./createDom.js";
import { applyDomProp } from "./applyProps.js";
import { setEvent, removeEvent } from "./applyEvents.js";

function arePathsEqual(leftPath = [], rightPath = []) {
  if (leftPath.length !== rightPath.length) {
    return false;
  }

  return leftPath.every((segment, index) => segment === rightPath[index]);
}

function orderPatches(patches = []) {
  return patches
    .map((patch, originalIndex) => ({ patch, originalIndex }))
    .sort((left, right) => {
      const leftPatch = left.patch;
      const rightPatch = right.patch;
      const leftIsRemove = leftPatch.type === PATCH_TYPES.REMOVE_CHILD;
      const rightIsRemove = rightPatch.type === PATCH_TYPES.REMOVE_CHILD;

      if (leftIsRemove && rightIsRemove && arePathsEqual(leftPatch.path, rightPatch.path)) {
        return rightPatch.index - leftPatch.index;
      }

      return left.originalIndex - right.originalIndex;
    })
    .map((entry) => entry.patch);
}

function getDomNodeByPath(rootDom, path = []) {
  let current = rootDom;

  for (const index of path) {
    if (!current || !current.childNodes || !current.childNodes[index]) {
      throw new Error(`Invalid patch path: ${path.join(".")}`);
    }

    current = current.childNodes[index];
  }

  return current;
}

function getParentByPath(rootDom, parentPath = []) {
  return getDomNodeByPath(rootDom, parentPath);
}

/**
 * 목적:
 * - 단일 patch를 DOM에 적용한다.
 *
 * 부작용:
 * - rootDom 하위 DOM 구조를 직접 변경한다.
 */
export function applySinglePatch(rootDom, patch, context = {}) {
  switch (patch.type) {
    case PATCH_TYPES.SET_PROP: {
      const target = getDomNodeByPath(rootDom, patch.path);
      applyDomProp(target, patch.name, patch.value);
      return;
    }

    case PATCH_TYPES.REMOVE_PROP: {
      const target = getDomNodeByPath(rootDom, patch.path);
      applyDomProp(target, patch.name, null);
      return;
    }

    case PATCH_TYPES.SET_TEXT: {
      const target = getDomNodeByPath(rootDom, patch.path);
      target.textContent = patch.value;
      return;
    }

    case PATCH_TYPES.INSERT_CHILD: {
      const parent = getParentByPath(rootDom, patch.path);
      const nextSibling = parent.childNodes[patch.index] ?? null;
      const newNode = createDomFromVNode(patch.node, context.documentRef ?? document);
      parent.insertBefore(newNode, nextSibling);
      return;
    }

    case PATCH_TYPES.REMOVE_CHILD: {
      const parent = getParentByPath(rootDom, patch.path);
      const child = parent.childNodes[patch.index];

      if (!child) {
        throw new Error(`Cannot remove child at index ${patch.index}`);
      }

      parent.removeChild(child);
      return;
    }

    case PATCH_TYPES.MOVE_CHILD: {
      const parent = getParentByPath(rootDom, patch.path);
      const child = parent.childNodes[patch.fromIndex];

      if (!child) {
        throw new Error(`Cannot move child from index ${patch.fromIndex}`);
      }

      const nextSibling = parent.childNodes[patch.toIndex] ?? null;
      parent.insertBefore(child, nextSibling);
      return;
    }

    case PATCH_TYPES.REPLACE_NODE: {
      const target = getDomNodeByPath(rootDom, patch.path);
      const replacement = createDomFromVNode(patch.node, context.documentRef ?? document);
      target.replaceWith(replacement);
      return;
    }

    case PATCH_TYPES.SET_EVENT: {
      const target = getDomNodeByPath(rootDom, patch.path);
      setEvent(target, patch.name, patch.handler);
      return;
    }

    case PATCH_TYPES.REMOVE_EVENT: {
      const target = getDomNodeByPath(rootDom, patch.path);
      removeEvent(target, patch.name);
      return;
    }

    default:
      throw new Error(`Unsupported patch type: ${patch.type}`);
  }
}

/**
 * 목적:
 * - patch list 전체를 순차 적용한다.
 */
export function applyPatches(rootDom, patches = [], context = {}) {
  for (const patch of orderPatches(patches)) {
    applySinglePatch(rootDom, patch, context);
  }

  return {
    appliedCount: patches.length,
  };
}
