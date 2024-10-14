/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiReportState } from "@eshg/employee-portal-api/statistics";
import { Chip, ChipProps } from "@mui/joy";

const statusNames = {
  [ApiReportState.Completed]: "Erstellt",
  [ApiReportState.Failed]: "Fehler",
  [ApiReportState.Creating]: "Wird erstellt",
  [ApiReportState.Planned]: "Geplant",
} satisfies Record<ApiReportState, string>;

const statusColors = {
  [ApiReportState.Completed]: "success",
  [ApiReportState.Failed]: "danger",
  [ApiReportState.Creating]: "warning",
  [ApiReportState.Planned]: "warning",
} satisfies Record<ApiReportState, ChipProps["color"]>;

export function ReportStateChip({ value }: { value: ApiReportState }) {
  return <Chip color={statusColors[value]}>{statusNames[value]}</Chip>;
}
