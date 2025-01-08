/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAvailableDataSource,
  ApiEvaluationState,
} from "@eshg/employee-portal-api/statistics";
import { isPlainObject } from "remeda";

import {
  DataSourceSensitivity,
  translateDataSourceSensitivity,
} from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";

export enum EvaluationTableFilterKey {
  DataSource = "dataSource",
  DateRangeStart = "dateRangeStart",
  DateRangeEnd = "dateRangeEnd",
  Status = "status",
  Sensitivity = "sensitivity",
}

export function createFilterDefinitions(
  dataSources: ApiAvailableDataSource[],
): FilterDefinition[] {
  return [
    {
      type: "Enum",
      key: EvaluationTableFilterKey.DataSource,
      name: "Datenquelle",
      options: dataSources.map((it) => ({
        label: it.name,
        value: it.id,
      })),
    } satisfies FilterDefinition,
    {
      type: "DateSpan",
      key: EvaluationTableFilterKey.DateRangeStart,
      name: "Zeitraum Start",
      inAccordion: true,
      doNotRequireStartAndEnd: true,
    } satisfies FilterDefinition,
    {
      type: "DateSpan",
      key: EvaluationTableFilterKey.DateRangeEnd,
      name: "Zeitraum Ende",
      doNotRequireStartAndEnd: true,
    } satisfies FilterDefinition,
    {
      type: "Enum",
      key: EvaluationTableFilterKey.Status,
      name: "Status",
      options: [
        { label: "Erstellt", value: ApiEvaluationState.Completed },
        { label: "Wird erstellt", value: ApiEvaluationState.Creating },
        { label: "Fehler", value: ApiEvaluationState.Failed },
      ],
    } satisfies FilterDefinition,
    {
      type: "Enum",
      key: EvaluationTableFilterKey.Sensitivity,
      name: "Sensibilität",
      options: [
        {
          label: translateDataSourceSensitivity(
            DataSourceSensitivity.Sensitive,
          ),
          value: DataSourceSensitivity.Sensitive,
        },
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
    } satisfies FilterDefinition,
  ].filter(isPlainObject);
}
