/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DragEvent, useCallback, useState } from "react";

import { FileLike } from "./types";

export function useDragAndDrop({
  onChange,
  validateType,
}: {
  validateType: (f: FileLike | null) => string | undefined;
  onChange: (f: File | null) => unknown;
}) {
  const [dropState, setDropState] = useState<"copy" | "no-drop" | undefined>();
  const handleFileDrop = useCallback(
    (ev: DragEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      setDropState(undefined);
      const firstItem = firstFile(ev.dataTransfer.items);
      if (!firstItem) {
        return;
      }
      const file = firstItem.getAsFile();
      const error = validateType(file);
      if (error) {
        return;
      }
      onChange(file);
    },
    [setDropState, onChange, validateType],
  );

  const handleFileDrag = useCallback(
    (ev: DragEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const firstItem = firstFile(ev.dataTransfer.items) ?? null;
      const error = validateType(firstItem);
      if (firstItem === null || error !== undefined) {
        setDropState("no-drop");
        ev.dataTransfer.dropEffect = "none";
        ev.dataTransfer.effectAllowed = "none";

        return;
      }
      setDropState("copy");
      ev.dataTransfer.dropEffect = "copy";
      ev.dataTransfer.effectAllowed = "copy";
    },
    [setDropState, validateType],
  );

  const handleFileDragLeave = useCallback(() => {
    setDropState(undefined);
  }, [setDropState]);

  return {
    handleFileDrop,
    handleFileDrag,
    handleFileDragLeave,
    dropState,
  };
}
function firstFile(items: DataTransferItemList) {
  // Our build target isn't high enough to iterate over this list
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < items.length; i++) {
    if (items[i]?.kind === "file") {
      return items[i];
    }
  }
}
