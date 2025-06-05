/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  queryOptions,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  GetInventoryItemsRequest,
  InventoryApi,
  LabelApi,
} from "@eshg/base-api";
import { unwrapRawResponse } from "@eshg/lib-portal";

import { useInventoryApi, useLabelApi } from "@/lib/baseModule/api/clients";
import { inventoryApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetInventoryOverviewPageQuery(
  request: GetInventoryItemsRequest,
) {
  const inventoryApi = useInventoryApi();
  const labelApi = useLabelApi();

  return useSuspenseQuery({
    queryFn: async () => {
      const inventory = await inventoryApi
        .getInventoryItemsRaw(request)
        .then(unwrapRawResponse);
      const labels = await labelApi.getLabels();
      return { inventory, labels };
    },
    queryKey: inventoryApiQueryKey(["getInventoryOverviewPage", request]),
    select: ({ inventory, labels }) => ({
      ...inventory,
      labels: labels.elements,
    }),
  });
}

function getInventoryItemQuery(
  inventoryApi: InventoryApi,
  labelApi: LabelApi,
  id: string,
) {
  return queryOptions({
    queryKey: inventoryApiQueryKey(["getInventoryItem", id]),
    queryFn: async () => {
      const labels = await labelApi.getLabels();
      const item = await inventoryApi.getInventoryItem(id);
      return { item, labels };
    },
  });
}

function getInventoryBookingHistoryQuery(
  inventoryApi: InventoryApi,
  id: string,
  page: number,
) {
  return queryOptions({
    queryKey: inventoryApiQueryKey(["getInventoryBookingHistory", id, page]),
    queryFn: () =>
      inventoryApi
        .getInventoryBookingHistoryRaw({
          id,
          pageSize: 5,
          pageNumber: page,
        })
        .then(unwrapRawResponse),
  });
}

export function useGetInventoryItem(id: string, bookingHistoryPage: number) {
  const inventoryApi = useInventoryApi();
  const labelApi = useLabelApi();

  return useSuspenseQueries({
    queries: [
      getInventoryItemQuery(inventoryApi, labelApi, id),
      getInventoryBookingHistoryQuery(inventoryApi, id, bookingHistoryPage),
    ],
  });
}
