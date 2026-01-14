/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip, Stack } from "@mui/joy";

import { LineWithPossibleExclamationMark } from "@/lib/businessModules/inspection/components/facility/pending/LineWithPossibleExclamationMark";

interface DuplicateTileLineProps<T> {
  dataset: T;
  importedDataset: T;
  textExtractor: (d: T) => string;
  suppressExclamationMark?: boolean;
  badgeText?: string;
}

export function DuplicateTileLine<T>({
  dataset,
  importedDataset,
  textExtractor,
  suppressExclamationMark,
  badgeText,
}: Readonly<DuplicateTileLineProps<T>>) {
  const text = textExtractor(dataset);
  const importedText = suppressExclamationMark
    ? text
    : textExtractor(importedDataset);

  return (
    <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
      <Stack direction="row" gap={0} flexGrow={1} justifyContent="flex-start">
        <LineWithPossibleExclamationMark
          text={text}
          importedText={importedText}
        />
      </Stack>
      {badgeText && (
        <Stack direction="row" gap={0} flexGrow={1} justifyContent="flex-end">
          <Chip
            sx={() => ({
              color: "white",
              bgcolor: "black",
              paddingTop: 0.5,
              paddingBottom: 0.5,
            })}
          >
            {badgeText}
          </Chip>
        </Stack>
      )}
    </Stack>
  );
}
