/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLabel } from "@eshg/employee-portal-api/base";
import { Chip, Stack } from "@mui/joy";

import { MoreLabelsButton } from "@/lib/baseModule/components/labels/MoreLabelsButton";

export function LabelList({
  labels,
  maxVisible,
  disableWrap,
}: {
  labels: ApiLabel[];
  maxVisible: number;
  disableWrap?: boolean;
}) {
  const sorted = labels.toSorted((a, b) => a.name.localeCompare(b.name));
  return (
    <Stack
      direction={"row"}
      gap={0.5}
      flexWrap={disableWrap ? undefined : "wrap"}
      sx={{
        overflow: "visible",
      }}
    >
      {sorted.slice(0, maxVisible).map((label) => (
        <Chip
          key={label.id}
          variant={"soft"}
          color={"primary"}
          size={"sm"}
          sx={{ margin: 0 }}
        >
          {label.name}
        </Chip>
      ))}
      <MoreLabelsButton visible={maxVisible} labels={sorted} />
    </Stack>
  );
}
