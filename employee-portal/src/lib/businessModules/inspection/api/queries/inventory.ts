/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useInventoryApi } from "@/lib/baseModule/api/clients";
import { inventoryApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useGetInventoryItems() {
  const inventoryApi = useInventoryApi();
  return useSuspenseQuery({
    queryKey: inventoryApiQueryKey(["getInventoryItems"]),
    queryFn: () => inventoryApi.getInventoryItems(),
    select: (response) => response.elements,
  });
}
