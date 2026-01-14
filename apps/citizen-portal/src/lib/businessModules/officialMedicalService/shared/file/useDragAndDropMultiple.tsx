/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DragEvent, useCallback, useState } from "react";

import { FileLike } from "@eshg/lib-portal";

export function useDragAndDropMultiple({
  onChange,
  validateType,
}: {
  validateType: (f: FileLike | null) => string | undefined;
  onChange: (f: File[]) => unknown;
}) {
  const [dropState, setDropState] = useState<"copy" | "no-drop" | undefined>();
  const handleFileDrop = useCallback(
    (ev: DragEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      setDropState(undefined);
      if (ev.dataTransfer.items) {
        const files: File[] = [];
        // Use DataTransferItemList interface to access the file(s)
        [...ev.dataTransfer.items].forEach((item) => {
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            const file = item.getAsFile();
            const error = validateType(file);
            if (error) {
              return;
            } else {
              return files.push(file!);
            }
          }
        });
        onChange(files);
      }
    },
    [setDropState, onChange, validateType],
  );

  const handleFileDrag = useCallback(
    (ev: DragEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      const errors: string[] = [];
      [...ev.dataTransfer.items]?.map((item) => {
        const error = validateType(item);
        if (error !== undefined) errors.push(error);
      });
      if (ev.dataTransfer.items === null || errors.length > 0) {
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
