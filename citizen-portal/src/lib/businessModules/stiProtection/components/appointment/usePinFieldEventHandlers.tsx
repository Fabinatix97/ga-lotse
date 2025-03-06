/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChangeEvent, ClipboardEvent, FocusEvent, KeyboardEvent } from "react";

type SetValue = (oldValue: string) => Promise<unknown>;
type SetValueAt = (v: string, index: number) => Promise<unknown>;
const numbers = Array(10)
  .fill(0)
  .map((_, i) => `${i}`);

export function usePinFieldEventHandlers({
  range,
  setValue,
  value,
}: {
  range: number[];
  value: string;
  setValue: SetValue;
}) {
  function setValueAt(char: string, index: number) {
    const parts = value.split("-");
    const newValue = range
      .map((_, partIndex) => {
        if (index === partIndex) {
          return char;
        }
        return parts[partIndex] ?? "";
      })
      .join("-");
    return setValue(newValue);
  }
  return {
    onFocus(e: FocusEvent<HTMLInputElement>) {
      e.currentTarget.select();
    },

    onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (e.code === "Backspace" || e.code === "Delete") {
        const value = e.currentTarget.value;
        if (value) {
          return;
        }
        clearPrevious(e.currentTarget, setValueAt);
      }
      if (!numbers.includes(e.key)) {
        return;
      }
      e.preventDefault();
      const [_, index] = parseName(e.currentTarget);
      void setValueAt(e.key, index);
      changeFocus(e.currentTarget, 1);
    },

    onChange(e: ChangeEvent<HTMLInputElement>) {
      const [_, index] = parseName(e.currentTarget);
      void setValueAt(e.currentTarget.value, index);
    },

    onPaste(e: ClipboardEvent<HTMLInputElement>) {
      e.preventDefault();
      const paste = e.clipboardData.getData("text");
      const parent = getFieldsetParent(e.currentTarget);
      const inputElement = e.currentTarget.querySelector("input");
      if (inputElement == null) {
        throw Error("No input element");
      }
      const [baseName, index] = parseName(inputElement);

      const oldValueParts = value.split("-");
      const newValueParts = paste.split("").slice(0, range.length - index);
      void setValue(
        range
          .map((_, i) => {
            const newIndex = i - index;
            if (newIndex >= 0 && newIndex < newValueParts.length) {
              return newValueParts[newIndex];
            }
            return oldValueParts[i];
          })
          .join("-"),
      );

      const lastChanged = index + newValueParts.length;
      const input =
        findInput(parent, baseName, lastChanged) ??
        findInput(parent, baseName, lastChanged - 1);
      if (input) {
        input.focus();
      }
    },
  };
}

function getFieldsetParent(e: HTMLElement) {
  let parent = e.parentElement;
  while (parent && parent?.nodeName != "FIELDSET") {
    parent = parent.parentElement;
  }
  if (parent == null) {
    throw Error("Element not nested in Fieldset");
  }
  return parent;
}
function findInput(parent: HTMLElement, baseName: string, index: number) {
  const nextName = `${baseName}.${index}`;
  const nextChild = parent.querySelector(`[name='${nextName}']`);
  if (nextChild == null || !(nextChild instanceof HTMLInputElement)) {
    return;
  }
  return nextChild;
}
function parseName(e: HTMLElement) {
  const name = e.getAttribute("name");
  if (name == null) {
    throw Error("No name for input field");
  }
  const nameParts = name.split(".");
  const lastNamePart = nameParts.at(-1);
  if (lastNamePart == null) {
    throw Error("Field name doesn't end with an index");
  }
  const index = parseInt(lastNamePart);
  const baseName = nameParts.slice(0, -1).join(".");
  return [baseName, index] as const;
}
function clearPrevious(e: HTMLInputElement, setValueAt: SetValueAt) {
  const parent = getFieldsetParent(e);
  const [baseName, lastIndex] = parseName(e);
  const nextChild = findInput(parent, baseName, lastIndex - 1);
  if (nextChild) {
    void setValueAt("", lastIndex - 1);
    nextChild.focus();
  }
}
function changeFocus(e: HTMLInputElement, direction: 1 | -1) {
  const parent = getFieldsetParent(e);
  const [baseName, lastIndex] = parseName(e);
  const nextChild = findInput(parent, baseName, lastIndex + direction);
  nextChild?.focus();
}
