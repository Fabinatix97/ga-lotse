/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProphylaxisStatus } from "@eshg/dental-api";
import { Chip, ChipProps } from "@mui/joy";

import { PROPHYLAXIS_STATUS } from "@/translations/prophylaxisSession";

const prophylaxisStatusColors: Record<
  ApiProphylaxisStatus,
  ChipProps["color"]
> = {
  OPEN: "neutral",
  CLOSED: "success",
};

interface ProphylaxisSessionStatusChipProps {
  status: ApiProphylaxisStatus;
}

export function ProphylaxisSessionStatusChip(
  props: ProphylaxisSessionStatusChipProps,
) {
  return (
    <Chip variant="soft" color={prophylaxisStatusColors[props.status]}>
      {PROPHYLAXIS_STATUS[props.status]}
    </Chip>
  );
}
