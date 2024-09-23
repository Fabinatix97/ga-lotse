/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { Select } from "@mui/joy";

import { Evaluation } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";

export const EvaluationSortOrder = {
  NewestFirst: "NEWEST_FIRST",
  OldestFirst: "OLDEST_FIRST",
  NameAscending: "NAME_ASCENDING",
  NameDescending: "NAME_DESCENDING",
} as const;
export type EvaluationSortOrder =
  (typeof EvaluationSortOrder)[keyof typeof EvaluationSortOrder];

export const evaluationSortOrderOptions: EnumMap<EvaluationSortOrder> = {
  [EvaluationSortOrder.NewestFirst]: "Neueste zuerst",
  [EvaluationSortOrder.OldestFirst]: "Älteste zuerst",
  [EvaluationSortOrder.NameAscending]: "Alphabetisch A-Z",
  [EvaluationSortOrder.NameDescending]: "Alphabetisch Z-A",
};

export function sortEvaluations(
  evaluations: Evaluation[],
  sortOrder: EvaluationSortOrder,
): Evaluation[] {
  switch (sortOrder) {
    case EvaluationSortOrder.NewestFirst:
      return evaluations.toSorted(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    case EvaluationSortOrder.OldestFirst:
      return evaluations.toSorted(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
    case EvaluationSortOrder.NameAscending:
      return evaluations.toSorted((a, b) => a.name.localeCompare(b.name, "de"));
    case EvaluationSortOrder.NameDescending:
      return evaluations.toSorted((a, b) => b.name.localeCompare(a.name, "de"));
  }
}

export interface EvaluationSortOrderSelectProps {
  sortOrder: EvaluationSortOrder;
  onSortOrderChange: (value: EvaluationSortOrder) => void;
}

export function EvaluationSortOrderSelect(
  props: EvaluationSortOrderSelectProps,
) {
  return (
    <Select
      aria-label="Sortierungsreihenfolge"
      sx={{
        width: 220,
      }}
      color="primary"
      value={props.sortOrder}
      onChange={(_, value) => props.onSortOrderChange(value!)}
    >
      <SelectOptions options={buildEnumOptions(evaluationSortOrderOptions)} />
    </Select>
  );
}
