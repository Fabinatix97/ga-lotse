/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDataSourceSensitivity } from "@eshg/employee-portal-api/statistics";
import { EnumMap } from "@eshg/lib-portal/types/helpers";

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
  return dataSourceSensitivity !== undefined
    ? DATA_SOURCE_SENSITIVITY_TRANSLATION[dataSourceSensitivity]
    : "Unbekannt";
}

export function mapDataSourceSensitivityApiToFrontend(
  apiDataSourceSensitivity: ApiDataSourceSensitivity | undefined,
) {
  switch (apiDataSourceSensitivity) {
    case ApiDataSourceSensitivity.Sensitive:
      return DataSourceSensitivity.Sensitive;
    case ApiDataSourceSensitivity.InternalUsage:
      return DataSourceSensitivity.InternalUsage;
    case ApiDataSourceSensitivity.Anonymous:
      return DataSourceSensitivity.Anonymous;
    case undefined:
      return undefined;
  }
}
