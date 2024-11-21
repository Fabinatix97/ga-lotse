/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiWaitingStatus } from "@eshg/employee-portal-api/stiProtection";
import { Chip, ChipProps } from "@mui/joy";

import { WAITING_STATUS_VALUES } from "@/lib/businessModules/stiProtection/features/procedures/translations";

const COLOR_MAP: { [S in ApiWaitingStatus]: ChipProps["color"] } = {
  [ApiWaitingStatus.WaitingForConsultation]: "warning",
  [ApiWaitingStatus.WaitingForResultsReview]: "warning",
  [ApiWaitingStatus.WaitingForTests]: "warning",
  [ApiWaitingStatus.InConsultation]: "primary",
  [ApiWaitingStatus.InTesting]: "primary",
  [ApiWaitingStatus.Cancelled]: "danger",
  [ApiWaitingStatus.Done]: "success",
};

export function StatusChip({ status }: { status?: ApiWaitingStatus }) {
  if (status == null) {
    return;
  }
  return <Chip color={COLOR_MAP[status]}>{WAITING_STATUS_VALUES[status]}</Chip>;
}
