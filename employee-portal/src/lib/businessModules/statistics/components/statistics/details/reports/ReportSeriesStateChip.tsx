/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Chip, ChipProps } from "@mui/joy";

export const ReportSeriesState = {
  Activated: "ACTIVATED",
  Deactivated: "DEACTIVATED",
} as const;
export type ReportSeriesState =
  (typeof ReportSeriesState)[keyof typeof ReportSeriesState];

const statusNames = {
  [ReportSeriesState.Activated]: "Aktiv",
  [ReportSeriesState.Deactivated]: "Deaktiviert",
} satisfies Record<ReportSeriesState, string>;

const statusColors = {
  [ReportSeriesState.Activated]: "success",
  [ReportSeriesState.Deactivated]: "neutral",
} satisfies Record<ReportSeriesState, ChipProps["color"]>;

export function ReportSeriesStateChip({ value }: { value: ReportSeriesState }) {
  return <Chip color={statusColors[value]}>{statusNames[value]}</Chip>;
}
