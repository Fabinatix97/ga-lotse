/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import Chip, { ChipProps } from "@mui/joy/Chip";

import { ApiArchivingRelevance } from "@eshg/lib-procedures-api";

import { archivingRelevanceNames } from "@/lib/shared/components/archiving/constants";

const CHIP_COLORS = {
  [ApiArchivingRelevance.Default]: "neutral",
  [ApiArchivingRelevance.Irrelevant]: "danger",
  [ApiArchivingRelevance.Relevant]: "primary",
} satisfies Record<ApiArchivingRelevance, ChipProps["color"]>;

export function ArchivingRelevanceChip({
  archivingRelevance,
}: {
  archivingRelevance: ApiArchivingRelevance;
}) {
  return (
    <Chip color={CHIP_COLORS[archivingRelevance]}>
      {archivingRelevanceNames[archivingRelevance]}
    </Chip>
  );
}
