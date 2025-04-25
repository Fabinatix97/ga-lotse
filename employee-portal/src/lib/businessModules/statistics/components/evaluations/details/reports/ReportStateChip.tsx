/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

import { ApiReportState } from "@eshg/statistics-api";

const statusNames = {
  [ApiReportState.Completed]: "Erstellt",
  [ApiReportState.Failed]: "Fehler",
  [ApiReportState.Creating]: "Wird erstellt",
  [ApiReportState.Planned]: "Geplant",
  [ApiReportState.Deleting]: "Wird gelöscht",
  [ApiReportState.AnonymizationFailed]: "Anonymisierungsfehler",
} satisfies Record<ApiReportState, string>;

const statusColors = {
  [ApiReportState.Completed]: "primary",
  [ApiReportState.Failed]: "danger",
  [ApiReportState.Creating]: "warning",
  [ApiReportState.Planned]: "warning",
  [ApiReportState.Deleting]: "warning",
  [ApiReportState.AnonymizationFailed]: "danger",
} satisfies Record<ApiReportState, ChipProps["color"]>;

export function ReportStateChip({ value }: { value: ApiReportState }) {
  return <Chip color={statusColors[value]}>{statusNames[value]}</Chip>;
}
