/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Dispatch, SetStateAction, startTransition } from "react";

import { ApiUser } from "@eshg/base-api";
import {
  EnumFilterDefinition,
  FilterValue,
  UseFilterSettings,
  buildOptionsFromUsers,
  getSelectedEnumFilterValues,
  useFilterSettings,
} from "@eshg/lib-employee-portal";

import { TeamviewFilters } from "@/lib/shared/api/queries/tasks";

const FILTER_KEYS = {
  assigneeId: "assigneeId",
};

interface TeamviewFilterSettingsProps {
  groupMembers: ApiUser[];
  onFilterApply: Dispatch<SetStateAction<TeamviewFilters>>;
}

export function useTeamviewFilterSettings({
  groupMembers,
  onFilterApply,
}: TeamviewFilterSettingsProps): UseFilterSettings {
  const filterDefinitions: EnumFilterDefinition[] = [
    {
      type: "Enum",
      key: FILTER_KEYS.assigneeId,
      name: "Bearbeiter:in",
      options: buildOptionsFromUsers(groupMembers),
    },
  ];

  return useFilterSettings({
    definitions: filterDefinitions,
    onValuesSubmit: (filters) => {
      startTransition(() => {
        onFilterApply({
          assigneeId: getAssigneeFilter(filters),
        });
      });
    },
    showSearch: false,
  });
}

function getAssigneeFilter(filters: FilterValue[]) {
  const selectedValues = getSelectedEnumFilterValues(
    filters,
    FILTER_KEYS.assigneeId,
  );
  return selectedValues.length !== 0 ? new Set(selectedValues) : undefined;
}
