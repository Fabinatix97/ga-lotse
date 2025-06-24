/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";
import {
  FilterValue,
  getFilterSelectedValue,
  getFilterSelectedValues,
  isInEnum,
  useQueryParamFilterSettings,
} from "@eshg/lib-employee-portal";
import {
  ApiOpenDataFileType,
  GetOpenDocumentsRequest,
} from "@eshg/opendata-api";

import { openDataFileTypes } from "@/lib/opendata/constants";
import { buildOpenDataBusinessModuleOptions } from "@/lib/opendata/helper";

const FILTER_KEYS = {
  year: "year",
  sources: "sources",
  fileType: "fileType",
};

export function useOpenDataFilterSettings() {
  return useQueryParamFilterSettings({
    definitions: [
      {
        type: "Year",
        key: FILTER_KEYS.year,
        name: "Jahr",
      },
      {
        type: "Enum",
        key: FILTER_KEYS.sources,
        name: "Quellen",
        options: buildOpenDataBusinessModuleOptions(),
      },
      {
        type: "EnumSingle",
        key: FILTER_KEYS.fileType,
        name: "Dateityp",
        options: openDataFileTypes.map(({ name }) => ({
          label: name,
          value: name,
        })),
      },
    ],
    onValuesSubmit: () => {
      // active values are synced via SearchParamStateProvider
    },
    showSearch: false,
  });
}

export function getOpenDataFilters(
  filterValues: FilterValue[],
): GetOpenDocumentsRequest {
  const fileType = getFilterSelectedValue(filterValues, FILTER_KEYS.fileType);

  return {
    statisticsYearFilter: getFilterSelectedValue(
      filterValues,
      FILTER_KEYS.year,
    ),
    fileTypeFilter: isInEnum(fileType, ApiOpenDataFileType)
      ? fileType
      : undefined,
    sourcesFilter: getFilterSelectedValues(
      filterValues,
      FILTER_KEYS.sources,
      ApiBusinessModule,
    ),
  };
}
