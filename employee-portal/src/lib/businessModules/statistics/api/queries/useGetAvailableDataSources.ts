/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetAvailableDataSourcesResponse,
  DataSourceApi,
} from "@eshg/statistics-api";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useDataSourceApi } from "@/lib/businessModules/statistics/api/clients";

import { dataSourceApiQueryKey } from "./apiQueryKeys";

export function createQueryGetAvailableDataSources(
  dataSourceApi: DataSourceApi,
) {
  return {
    queryKey: dataSourceApiQueryKey(["getAvailableDataSources"]),
    queryFn: () => dataSourceApi.getAvailableDataSources(),
    select: (data: ApiGetAvailableDataSourcesResponse) =>
      data.availableDataSources,
  };
}

export function useGetAvailableDataSources() {
  const dataSourceApi = useDataSourceApi();
  const queryResult = useSuspenseQuery(
    createQueryGetAvailableDataSources(dataSourceApi),
  );
  return queryResult.data;
}
