/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetRelevantArchivableProceduresRequest } from "@eshg/employee-portal-api/businessProcedures";

import { getFilterDate } from "@/lib/shared/components/archiving/helper";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { UseFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { useSearchParamFilterSettings } from "@/lib/shared/components/filterSettings/useSearchParamFilterSettings";
import { getSelectedFilterValues } from "@/lib/shared/components/procedures/helper";

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
  const visibilityValues = getSelectedFilterValues(
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
