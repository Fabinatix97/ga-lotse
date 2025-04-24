/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAuditLogSource,
  ApiAuditLogSourceFromJSON,
} from "@eshg/auditlog-api";
import {
  FilterDefinition,
  FilterValue,
  UseFilterSettings,
  UseTableControlResult,
  useFilterSettings,
} from "@eshg/lib-employee-portal";
import { ensureArray } from "@eshg/lib-portal/helpers/guards";
import { SearchParams } from "@eshg/lib-portal/types/pageParams";
import { isString } from "remeda";

import { SearchParamsKeys } from "@/lib/auditlog/queries/auditlog";
import { auditLogSourceNames } from "@/lib/shared/components/auditlog/constants";
import { getSelectedFilterValues } from "@/lib/shared/components/procedures/helper";

const FILTER_DEFINITION_KEYS = {
  source: "source",
  date: "date",
};

interface TaskTableFilterSettingsProps {
  tableControl: UseTableControlResult;
  searchParams: SearchParams;
}

export function useAuditLogAdminFilterSettings({
  tableControl,
  searchParams,
}: TaskTableFilterSettingsProps): UseFilterSettings {
  const filterDefinitions: FilterDefinition[] = [
    {
      type: "DateSpan",
      key: FILTER_DEFINITION_KEYS.date,
      name: "Datum",
      maxInputPast: true,
    },
    {
      type: "Enum",
      key: FILTER_DEFINITION_KEYS.source,
      name: "Modul",
      options: buildOptionsFromAuditLogSources(),
    },
  ];
  const initialValues = getInitialValues(searchParams);

  return useFilterSettings({
    definitions: filterDefinitions,
    initialValues: initialValues,
    onValuesSubmit: (filters) => {
      const startDateFilter = getSelectedStartDateValue(
        filters,
        FILTER_DEFINITION_KEYS.date,
      );
      const endDateFilter = getSelectedEndDateValue(
        filters,
        FILTER_DEFINITION_KEYS.date,
      );
      const sourceFilter = getAuditLogSourceFilters(filters);

      tableControl.setFilter(
        [
          { name: SearchParamsKeys.startDate, value: startDateFilter },
          { name: SearchParamsKeys.endDate, value: endDateFilter },
          {
            name: SearchParamsKeys.source,
            value: sourceFilter ? Array.from(sourceFilter.values()) : undefined,
          },
        ],
        true,
      );
    },
    showSearch: false,
  });
}

function getInitialValues(searchParams: SearchParams): FilterValue[] {
  function parseEnumFilterValue(): FilterValue[] {
    const searchParamValue = searchParams[SearchParamsKeys.source];

    if (searchParamValue === null || searchParamValue === undefined) {
      return [];
    }

    return [
      {
        type: "Enum",
        key: FILTER_DEFINITION_KEYS.source,
        selectedValues: ensureArray(searchParamValue),
      },
    ];
  }

  function parseDateFilterValue(): FilterValue[] {
    const startDate = searchParams[SearchParamsKeys.startDate];
    const endDate = searchParams[SearchParamsKeys.endDate];

    if (!(isString(startDate) && isString(endDate))) {
      return [];
    }

    return [
      {
        type: "DateSpan",
        key: FILTER_DEFINITION_KEYS.date,
        startDate: startDate,
        endDate: endDate,
      },
    ];
  }

  return [...parseEnumFilterValue(), ...parseDateFilterValue()];
}

export function buildOptionsFromAuditLogSources() {
  return Object.values(ApiAuditLogSource).map(buildOptionFromAuditLogSource);
}

function buildOptionFromAuditLogSource(auditLogSource: ApiAuditLogSource) {
  return { value: auditLogSource, label: auditLogSourceNames[auditLogSource] };
}

export function getSelectedStartDateValue(
  filters: FilterValue[],
  ...key: string[]
) {
  return filters
    .filter((filterValue) => filterValue.type === "DateSpan")
    .find((filterValue) => key.includes(filterValue.key))?.startDate;
}

export function getSelectedEndDateValue(
  filters: FilterValue[],
  ...key: string[]
) {
  return filters
    .filter((filterValue) => filterValue.type === "DateSpan")
    .find((filterValue) => key.includes(filterValue.key))?.endDate;
}

function getAuditLogSourceFilters(filters: FilterValue[]) {
  const selectedValues = getSelectedFilterValues(
    filters,
    FILTER_DEFINITION_KEYS.source,
  ).map((v) => ApiAuditLogSourceFromJSON(v));
  return selectedValues.length !== 0 ? new Set(selectedValues) : undefined;
}
