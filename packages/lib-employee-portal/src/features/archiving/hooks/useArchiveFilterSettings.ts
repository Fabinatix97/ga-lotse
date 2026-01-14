/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiArchivingRelevance,
  ApiGetArchivingConfigurationResponse,
  ApiProcedureType,
  GetArchivableProceduresRequest,
} from "@eshg/lib-procedures-api";

import { buildOptionsFromProcedureTypes } from "../../../utils/mappers";
import { UseFilterSettings } from "../../filters/hooks/useFilterSettings";
import { useQueryParamFilterSettings } from "../../filters/hooks/useQueryParamFilterSettings";
import { FilterDefinition } from "../../filters/types/FilterDefinition";
import { FilterValue } from "../../filters/types/FilterValue";
import {
  getFilterDate,
  getFilterSelectedValues,
} from "../../filters/utils/filterValues";
import { ARCHIVING_RELEVANCE_NAMES } from "../translations/relevanceNames";

const FILTER_KEYS = {
  closedAtDay: "closedAtDay",
  defaultArchivingRelevance: "defaultArchivingRelevance",
  procedureType: "procedureType",
};

export function useArchiveFilterSettings(
  procedureTypes: ApiProcedureType[],
  configuration: ApiGetArchivingConfigurationResponse,
): UseFilterSettings {
  // A list of procedure types is provided by the frontend,
  // to obtain a list of relevant archivingRelevances for the current view from the configuration
  const availableArchivingRelevances = buildArchivingRelevanceFilter(
    procedureTypes,
    configuration,
  );
  const filterDefinitions: FilterDefinition[] = [
    {
      type: "Date",
      key: FILTER_KEYS.closedAtDay,
      name: "Geschlossen am",
    },
    ...(procedureTypes.length > 1
      ? ([
          {
            type: "Enum",
            key: FILTER_KEYS.procedureType,
            name: "Vorgangsart",
            options: buildOptionsFromProcedureTypes(procedureTypes),
          },
        ] as const)
      : []),
    ...(availableArchivingRelevances.size > 1
      ? ([
          {
            type: "Enum",
            key: FILTER_KEYS.defaultArchivingRelevance,
            name: "Standard-Aktion",
            options: buildOptionsFromArchivingRelevances(
              availableArchivingRelevances,
            ),
          },
        ] as const)
      : []),
  ];

  return useQueryParamFilterSettings({
    definitions: filterDefinitions,
    onValuesSubmit: () => {
      // active values are synced via SearchParamStateProvider
    },
    showSearch: false,
  });
}

export function getArchivableProceduresFilters(
  filterValues: FilterValue[],
): Pick<
  GetArchivableProceduresRequest,
  "closedAtDay" | "defaultArchivingRelevance" | "procedureType"
> {
  return {
    closedAtDay: getFilterDate(filterValues, FILTER_KEYS.closedAtDay),
    procedureType: new Set(
      getFilterSelectedValues(
        filterValues,
        FILTER_KEYS.procedureType,
        ApiProcedureType,
      ),
    ),
    defaultArchivingRelevance: new Set(
      getFilterSelectedValues(
        filterValues,
        FILTER_KEYS.defaultArchivingRelevance,
        ApiArchivingRelevance,
      ),
    ),
  };
}

function buildArchivingRelevanceFilter(
  procedureTypes: ApiProcedureType[],
  configuration: ApiGetArchivingConfigurationResponse,
) {
  return new Set(
    procedureTypes
      .map(
        (procedureType) =>
          configuration.archivingDetails[procedureType]?.archivingRelevance,
      )
      .filter((archivingRelevance) => archivingRelevance !== undefined)
      .sort()
      .reverse(),
  );
}

function buildOptionsFromArchivingRelevances(
  archivingRelevances: Set<ApiArchivingRelevance>,
) {
  return Array.from(archivingRelevances).map((value) => ({
    value,
    label: ARCHIVING_RELEVANCE_NAMES[value],
  }));
}
