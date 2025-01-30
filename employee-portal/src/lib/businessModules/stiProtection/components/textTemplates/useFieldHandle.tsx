/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { MutableRefObject } from "react";
import { isString } from "remeda";

export interface UseFieldHandle {
  appendText: (text: string) => Promise<void>;
  finishEditing: () => void;
}

export function useFieldHandle({
  name,
  ref,
}: {
  name: string;
  ref: MutableRefObject<HTMLTextAreaElement | null>;
}) {
  const { setFieldValue, getFieldMeta } = useFormikContext();
  const { value } = getFieldMeta(name);

  return {
    async appendText(text: string) {
      const currentValue = isString(value) ? value : "";
      const newValue = currentValue + `\n` + text;
      await setFieldValue(name, newValue.trim());
    },
    finishEditing() {
      if (ref?.current == null) {
        return;
      }
      ref.current.focus();
      const firstPoint = nextInsertPoint(value, 0);
      if (firstPoint) {
        ref.current.selectionStart = firstPoint.start;
        ref.current.selectionEnd = firstPoint.end;
      }
    },
  };
}

const replacementRegex = /\$(\d|\w|_)*/;
export interface InsertPoint {
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
  if (match?.index == null || match[0] == null) {
    return;
  }
  const start = startSearch + match.index;
  return { start, end: start + match[0].length };
}
