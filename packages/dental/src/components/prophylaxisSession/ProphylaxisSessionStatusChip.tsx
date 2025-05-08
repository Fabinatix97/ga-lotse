/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

import { ApiProphylaxisStatus } from "@eshg/dental-api";

import { PROPHYLAXIS_STATUS } from "../../translations/prophylaxisSession";

const prophylaxisStatusColors: Record<
  ApiProphylaxisStatus,
  ChipProps["color"]
> = {
  OPEN: "neutral",
  CLOSED: "success",
};

interface ProphylaxisSessionStatusChipProps {
  status: ApiProphylaxisStatus;
  "data-testid"?: string;
}

export function ProphylaxisSessionStatusChip(
  props: ProphylaxisSessionStatusChipProps,
) {
  return (
    <Chip
      variant="soft"
      color={prophylaxisStatusColors[props.status]}
      data-testid={props["data-testid"]}
    >
      {PROPHYLAXIS_STATUS[props.status]}
    </Chip>
  );
}
