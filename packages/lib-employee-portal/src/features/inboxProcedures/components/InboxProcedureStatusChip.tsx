/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import Chip, { ChipProps } from "@mui/joy/Chip";

import { ApiInboxProcedureStatus } from "@eshg/lib-procedures-api";

import { statusNames } from "../config/translations";

const statusColors: Record<ApiInboxProcedureStatus, ChipProps["color"]> = {
  [ApiInboxProcedureStatus.Closed]: "danger",
  [ApiInboxProcedureStatus.Open]: "warning",
};

interface InboxProcedureStatusChipProps {
  status: ApiInboxProcedureStatus;
}

export function InboxProcedureStatusChip({
  status,
}: InboxProcedureStatusChipProps) {
  return <Chip color={statusColors[status]}>{statusNames[status]}</Chip>;
}
