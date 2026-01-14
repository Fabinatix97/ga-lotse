/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetRelevantArchivableProceduresRequest } from "@eshg/lib-procedures-api";

import { UseFilterSettings } from "../../filters/hooks/useFilterSettings";
import { useQueryParamFilterSettings } from "../../filters/hooks/useQueryParamFilterSettings";
import { FilterDefinition } from "../../filters/types/FilterDefinition";
import { FilterValue } from "../../filters/types/FilterValue";
import { getFilterDate } from "../../filters/utils/filterValues";
import { getSelectedEnumFilterValues } from "../../filters/utils/getSelectedEnumFilterValues";

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

  return useQueryParamFilterSettings({
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
