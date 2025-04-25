/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { EnumMap } from "@eshg/lib-portal/types/helpers";
import {
  ApiDataSourceSensitivity,
  ApiReportDataSensitivity,
} from "@eshg/statistics-api";

export const DataSourceSensitivity = {
  Sensitive: "SENSITIVE",
  InternalUsage: "INTERNAL_USAGE",
  Anonymous: "ANONYMOUS",
} as const;
export type DataSourceSensitivity =
  (typeof DataSourceSensitivity)[keyof typeof DataSourceSensitivity];

const DATA_SOURCE_SENSITIVITY_TRANSLATION: EnumMap<DataSourceSensitivity> = {
  [DataSourceSensitivity.Sensitive]: "Sensibel",
  [DataSourceSensitivity.InternalUsage]: "Interner Gebrauch",
  [DataSourceSensitivity.Anonymous]: "Anonym",
};

export function translateDataSourceSensitivity(
  dataSourceSensitivity: DataSourceSensitivity | undefined,
) {
  return isDefined(dataSourceSensitivity)
    ? DATA_SOURCE_SENSITIVITY_TRANSLATION[dataSourceSensitivity]
    : "Unbekannt";
}

const SENSITIVITY_MAP: Record<ApiDataSourceSensitivity, DataSourceSensitivity> =
  {
    [ApiDataSourceSensitivity.Sensitive]: DataSourceSensitivity.Sensitive,
    [ApiDataSourceSensitivity.InternalUsage]:
      DataSourceSensitivity.InternalUsage,
    [ApiDataSourceSensitivity.Anonymous]: DataSourceSensitivity.Anonymous,
  };

export function mapDataSourceSensitivityApiToFrontend(
  apiDataSourceSensitivity: ApiDataSourceSensitivity,
): DataSourceSensitivity {
  return SENSITIVITY_MAP[apiDataSourceSensitivity];
}

export function mapEvaluationDataSourceSensitivityFrontendToApi(
  dataSourceSensitivity: DataSourceSensitivity,
) {
  switch (dataSourceSensitivity) {
    case DataSourceSensitivity.Sensitive:
      return ApiDataSourceSensitivity.Sensitive;
    case DataSourceSensitivity.InternalUsage:
      return ApiDataSourceSensitivity.InternalUsage;
    case DataSourceSensitivity.Anonymous:
      return ApiDataSourceSensitivity.Anonymous;
  }
}

export function mapReportDataSourceSensitivityFrontendToApi(
  dataSourceSensitivity: DataSourceSensitivity,
) {
  switch (dataSourceSensitivity) {
    case "SENSITIVE":
      throw new Error("Illegal argument!");
    case DataSourceSensitivity.InternalUsage:
      return ApiReportDataSensitivity.InternalUsage;
    case DataSourceSensitivity.Anonymous:
      return ApiReportDataSensitivity.Anonymous;
  }
}
