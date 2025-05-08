/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Select } from "@mui/joy";

import { SelectOptions } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

import { Analysis } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

export const AnalysisSortOrder = {
  NameAscending: "NAME_ASCENDING",
  NameDescending: "NAME_DESCENDING",
} as const;
export type AnalysisSortOrder =
  (typeof AnalysisSortOrder)[keyof typeof AnalysisSortOrder];

const analysisSortOrderOptions: EnumMap<AnalysisSortOrder> = {
  [AnalysisSortOrder.NameAscending]: "Alphabetisch A-Z",
  [AnalysisSortOrder.NameDescending]: "Alphabetisch Z-A",
};

export function sortAnalyses(
  analyses: Analysis[],
  sortOrder: AnalysisSortOrder,
): Analysis[] {
  switch (sortOrder) {
    case AnalysisSortOrder.NameAscending:
      return analyses.toSorted((a, b) => a.name.localeCompare(b.name, "de"));
    case AnalysisSortOrder.NameDescending:
      return analyses.toSorted((a, b) => b.name.localeCompare(a.name, "de"));
  }
}

interface AnalysisSortOrderSelectProps {
  sortOrder: AnalysisSortOrder;
  onSortOrderChange: (value: AnalysisSortOrder) => void;
}

export function AnalysisSortOrderSelect(props: AnalysisSortOrderSelectProps) {
  return (
    <Select
      aria-label="Sortierungsreihenfolge"
      sx={{
        width: 220,
      }}
      color="primary"
      value={props.sortOrder}
      onChange={(_, value) => {
        if (value === null) {
          return;
        }
        props.onSortOrderChange(value);
      }}
    >
      <SelectOptions options={buildEnumOptions(analysisSortOrderOptions)} />
    </Select>
  );
}
