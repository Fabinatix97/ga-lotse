/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEvaluationState } from "@eshg/statistics-api";
import { Chip, ChipProps } from "@mui/joy";

const statusNames = {
  [ApiEvaluationState.Completed]: "Erstellt",
  [ApiEvaluationState.Failed]: "Fehler",
  [ApiEvaluationState.Creating]: "Wird erstellt",
  [ApiEvaluationState.CopyOngoing]: "Wird kopiert",
  [ApiEvaluationState.Updating]: "Wird aktualisiert",
  [ApiEvaluationState.Deleting]: "Wird gelöscht",
} satisfies Record<ApiEvaluationState, string>;

const statusColors = {
  [ApiEvaluationState.Completed]: "success",
  [ApiEvaluationState.Failed]: "danger",
  [ApiEvaluationState.Creating]: "warning",
  [ApiEvaluationState.CopyOngoing]: "warning",
  [ApiEvaluationState.Updating]: "warning",
  [ApiEvaluationState.Deleting]: "warning",
} satisfies Record<ApiEvaluationState, ChipProps["color"]>;

export function StateChip({ value }: { value: ApiEvaluationState }) {
  return <Chip color={statusColors[value]}>{statusNames[value]}</Chip>;
}
