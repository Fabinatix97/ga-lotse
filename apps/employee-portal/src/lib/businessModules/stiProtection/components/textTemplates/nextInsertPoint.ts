/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isString } from "remeda";

const replacementRegex = /\$(\d|\w|_)*/;
interface InsertPoint {
  start: number;
  end: number;
}
export function nextInsertPoint(
  value: unknown,
  startSearch: number,
): InsertPoint | undefined {
  const currentValue = isString(value) ? value : "";
  const remainingText = currentValue.slice(startSearch);
  const match = replacementRegex.exec(remainingText);
  if (match?.index === undefined || match[0] === undefined) {
    return;
  }
  const start = startSearch + match.index;
  return { start, end: start + match[0].length };
}

export function selectFirstPoint(textarea: HTMLTextAreaElement | null) {
  if (textarea === null) {
    return;
  }
  textarea.focus();
  const firstPoint = nextInsertPoint(textarea.value, 0);
  if (firstPoint) {
    textarea.selectionStart = firstPoint.start;
    textarea.selectionEnd = firstPoint.end;
  }
}

export function appendText(text: string, value: unknown) {
  const currentValue = isString(value) ? value : "";
  if (currentValue === "") {
    return text;
  }
  return currentValue + `\n` + text;
}
