/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FilterDefinition,
  FilterValue,
  UseFilterSettings,
  getSelectedEnumFilterValues,
} from "@eshg/lib-employee-portal";
import { GetRelevantArchivableProceduresRequest } from "@eshg/lib-procedures-api";

import { useSearchParamFilterSettings } from "@/lib/shared/components/filterSettings/useSearchParamFilterSettings";
import { getFilterDate } from "@/lib/shared/helpers/filter";

const FILTER_KEYS = {
  closedAtDay: "closedAtDay",
  visibility: "visibility",
};
const FILTER_VISIBILITY_VALUES = {
  hideExported: "hideExported",
};

export function useArchiveAdminFilterSettings(): UseFilterSettings {
  const filterDefinitions: FilterDefinition[] = [
    {
      type: "Date",
      key: FILTER_KEYS.closedAtDay,
      name: "Geschlossen am",
    },
    {
      type: "Enum",
      key: FILTER_KEYS.visibility,
      name: "Sichtbarkeit",
      inAccordion: false,
      options: [
        {
          label: "Bereits exportierte Vorgänge verbergen",
          value: FILTER_VISIBILITY_VALUES.hideExported,
        },
      ],
    },
  ];

  return useSearchParamFilterSettings({
    definitions: filterDefinitions,
    onValuesSubmit: () => {
      // active values are synced via SearchParamStateProvider
    },
    showSearch: false,
  });
}

export function getRelevantArchivableProceduresFilters(
  filterValues: FilterValue[],
): Pick<GetRelevantArchivableProceduresRequest, "closedAtDay" | "exported"> {
  const visibilityValues = getSelectedEnumFilterValues(
    filterValues,
    FILTER_KEYS.visibility,
  );
  const hideExported = visibilityValues.includes(
    FILTER_VISIBILITY_VALUES.hideExported,
  );

  return {
    closedAtDay: getFilterDate(filterValues, FILTER_KEYS.closedAtDay),
    exported: hideExported ? false : undefined,
  };
}
