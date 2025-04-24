/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FilterDefinition } from "@eshg/lib-employee-portal";
import { ApiAvailableDataSource, ApiReportType } from "@eshg/statistics-api";

import { translateReportType } from "@/lib/businessModules/statistics/api/mapper/translateReportType";
import {
  DataSourceSensitivity,
  translateDataSourceSensitivity,
} from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";

export enum ReportOverviewFilterKey {
  DataSource = "dataSource",
  DateRangeStart = "dateRangeStart",
  DateRangeEnd = "dateRangeEnd",
  ReportType = "reportType",
  Sensitivity = "sensitivity",
}

export function createFilterDefinitions(dataSources: ApiAvailableDataSource[]) {
  return [
    {
      type: "Enum",
      key: ReportOverviewFilterKey.DataSource,
      name: "Datenquelle",
      options: dataSources.map((it) => ({
        label: it.name,
        value: it.id,
      })),
    },
    {
      type: "DateSpan",
      key: ReportOverviewFilterKey.DateRangeStart,
      name: "Zeitraum Start",
      doNotRequireStartAndEnd: true,
    },
    {
      type: "DateSpan",
      key: ReportOverviewFilterKey.DateRangeEnd,
      name: "Zeitraum Ende",
      doNotRequireStartAndEnd: true,
    },
    {
      type: "Enum",
      key: ReportOverviewFilterKey.ReportType,
      name: "Report-Typ",
      options: [
        {
          label: translateReportType[ReportDataType.Series],
          value: ApiReportType.Auto,
        },
        {
          label: translateReportType[ReportDataType.Single],
          value: ApiReportType.Manual,
        },
      ],
    },
    {
      type: "Enum",
      key: ReportOverviewFilterKey.Sensitivity,
      name: "Sensibilität",
      options: [
        {
          label: translateDataSourceSensitivity(
            DataSourceSensitivity.InternalUsage,
          ),
          value: DataSourceSensitivity.InternalUsage,
        },
        {
          label: translateDataSourceSensitivity(
            DataSourceSensitivity.Anonymous,
          ),
          value: DataSourceSensitivity.Anonymous,
        },
      ],
    },
  ] satisfies FilterDefinition[];
}
