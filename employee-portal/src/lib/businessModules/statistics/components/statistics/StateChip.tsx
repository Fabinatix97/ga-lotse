/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStatisticState } from "@eshg/employee-portal-api/statistics";
import { Chip, ChipProps } from "@mui/joy";

const statusNames = {
  [ApiStatisticState.Completed]: "Erstellt",
  [ApiStatisticState.Failed]: "Fehler",
  [ApiStatisticState.Creating]: "Wird erstellt",
  [ApiStatisticState.CopyOngoing]: "Wird kopiert",
  [ApiStatisticState.Updating]: "Wird aktualisiert",
} satisfies Record<ApiStatisticState, string>;

const statusColors = {
  [ApiStatisticState.Completed]: "success",
  [ApiStatisticState.Failed]: "danger",
  [ApiStatisticState.Creating]: "warning",
  [ApiStatisticState.CopyOngoing]: "warning",
  [ApiStatisticState.Updating]: "warning",
} satisfies Record<ApiStatisticState, ChipProps["color"]>;

export function StateChip({ value }: { value: ApiStatisticState }) {
  return <Chip color={statusColors[value]}>{statusNames[value]}</Chip>;
}
