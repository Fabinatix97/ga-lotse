/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps, Stack } from "@mui/joy";

import { ApiLabel } from "@eshg/base-api";

import { MoreLabelsButton } from "@/lib/baseModule/components/labels/MoreLabelsButton";

export function LabelList({
  labels,
  maxVisible,
  disableWrap,
  chipSize,
}: {
  labels: ApiLabel[];
  maxVisible: number;
  disableWrap?: boolean;
  chipSize?: ChipProps["size"];
}) {
  const sorted = labels.toSorted((a, b) => a.name.localeCompare(b.name));
  return (
    <Stack
      direction="row"
      gap={0.5}
      flexWrap={disableWrap ? undefined : "wrap"}
      sx={{
        overflow: "visible",
      }}
    >
      {sorted.slice(0, maxVisible).map((label) => (
        <Chip
          key={label.id}
          variant="soft"
          color="primary"
          size={chipSize ?? "sm"}
          sx={{ margin: 0 }}
        >
          {label.name}
        </Chip>
      ))}
      <MoreLabelsButton visible={maxVisible} labels={sorted} />
    </Stack>
  );
}
