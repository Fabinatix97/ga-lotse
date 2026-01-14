/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FilterDefinition } from "@eshg/lib-employee-portal";
import { ApiAvailableDataSource } from "@eshg/statistics-api";

export enum EvaluationTemplatesFilterKey {
  DataSource = "dataSource",
  CreatedAt = "createdAt",
}

export function createFilterDefinitions(dataSources: ApiAvailableDataSource[]) {
  return [
    {
      type: "Enum",
      key: EvaluationTemplatesFilterKey.DataSource,
      name: "Datenquelle",
      options: dataSources.map((it) => ({
        label: it.name,
        value: it.id,
      })),
    },
    {
      type: "DateSpan",
      key: EvaluationTemplatesFilterKey.CreatedAt,
      name: "Erstellt am",
      doNotRequireStartAndEnd: true,
    },
  ] satisfies FilterDefinition[];
}
