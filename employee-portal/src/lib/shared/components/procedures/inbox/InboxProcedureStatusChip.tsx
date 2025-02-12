/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiInboxProcedureStatus } from "@eshg/lib-procedures-api";
import Chip from "@mui/joy/Chip";

import { statusColors, statusNames } from "./constants";

interface InboxProcedureStatusChipProps {
  status: ApiInboxProcedureStatus;
}

export function InboxProcedureStatusChip({
  status,
}: InboxProcedureStatusChipProps) {
  return <Chip color={statusColors[status]}>{statusNames[status]}</Chip>;
}
