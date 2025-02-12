/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUser } from "@eshg/base-api";
import { ApiProgressEntryClassFromJSON } from "@eshg/lib-procedures-api";
import { Dispatch, SetStateAction, startTransition } from "react";

import { EnumFilterDefinition } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import {
  UseFilterSettings,
  useFilterSettings,
} from "@/lib/shared/components/filterSettings/useFilterSettings";
import {
  buildOptionsFromManualProgressEntryTypes,
  buildOptionsFromProgressEntryClasses,
  buildOptionsFromRecord,
  buildOptionsFromUsers,
  getSelectedFilterValues,
} from "@/lib/shared/components/procedures/helper";
import { generalSystemProgressEntryTypeTitles } from "@/lib/shared/components/procedures/progress-entries/constants";
import { ProgressEntriesFilters } from "@/lib/shared/components/procedures/progress-entries/types";

const FILTER_KEYS = {
  initiatedBy: "initiatedBy",
  progressEntryTypeManualProgressEntry: "progressEntryTypeManualProgressEntry",
  progressEntryTypeSystemProgressEntry: "progressEntryTypeSystemProgressEntry",
  progressEntryTypeStandard: "progressEntryTypeStandard",
  progressEntryClass: "progressEntryClass",
};

interface ProgressEntriesFilterSettingsProps {
  users: ApiUser[];
  systemProgressEntryTypes: Record<string, string>;
  onFilterApply: Dispatch<SetStateAction<ProgressEntriesFilters>>;
}

export function useProgressEntriesFilterSettings({
  users,
  systemProgressEntryTypes,
  onFilterApply,
}: ProgressEntriesFilterSettingsProps): UseFilterSettings {
  const filterDefinitions: EnumFilterDefinition[] = [
    {
      type: "Enum",
      key: FILTER_KEYS.initiatedBy,
      name: "Bearbeiter:in",
      options: buildOptionsFromUsers(users),
    },
    {
      type: "Enum",
      key: FILTER_KEYS.progressEntryTypeManualProgressEntry,
      name: "Manuelle Typen",
      options: buildOptionsFromManualProgressEntryTypes(),
    },
    {
      type: "Enum",
      key: FILTER_KEYS.progressEntryTypeSystemProgressEntry,
      name: "System Typen",
      options: buildOptionsFromRecord(systemProgressEntryTypes),
    },
    {
      type: "Enum",
      key: FILTER_KEYS.progressEntryTypeStandard,
      name: "Standard Typen",
      options: buildOptionsFromRecord(generalSystemProgressEntryTypeTitles),
    },
    {
      type: "Enum",
      key: FILTER_KEYS.progressEntryClass,
      name: "Art",
      options: buildOptionsFromProgressEntryClasses(),
    },
  ];

  return useFilterSettings({
    definitions: filterDefinitions,
    onValuesSubmit: (filters) => {
      startTransition(() => {
        onFilterApply({
          initiatedBy: getInitiatedByFilters(filters),
          progressEntryType: getProgressEntryTypeFilters(filters),
          progressEntryClass: getProgressEntryClassFilters(filters),
        });
      });
    },
    showSearch: false,
    scalingWidth: true,
  });
}

function getInitiatedByFilters(filters: FilterValue[]) {
  const selectedValues = getSelectedFilterValues(
    filters,
    FILTER_KEYS.initiatedBy,
  );
  return selectedValues.length != 0 ? new Set(selectedValues) : undefined;
}

function getProgressEntryTypeFilters(filters: FilterValue[]) {
  const selectedValues = getSelectedFilterValues(
    filters,
    FILTER_KEYS.progressEntryTypeManualProgressEntry,
    FILTER_KEYS.progressEntryTypeSystemProgressEntry,
    FILTER_KEYS.progressEntryTypeStandard,
  );
  return selectedValues.length != 0 ? new Set(selectedValues) : undefined;
}

function getProgressEntryClassFilters(filters: FilterValue[]) {
  const selectedValues = getSelectedFilterValues(
    filters,
    FILTER_KEYS.progressEntryClass,
  ).map((v) => ApiProgressEntryClassFromJSON(v));
  return selectedValues.length != 0 ? new Set(selectedValues) : undefined;
}
