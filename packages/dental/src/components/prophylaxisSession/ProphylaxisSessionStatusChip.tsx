/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";

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
  invisibleStatusLabel?: boolean;
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
      {props.invisibleStatusLabel && (
        <Typography component="span" sx={visuallyHidden}>
          Status:
        </Typography>
      )}
      {PROPHYLAXIS_STATUS[props.status]}
    </Chip>
  );
}
