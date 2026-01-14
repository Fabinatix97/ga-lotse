/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import {
  useUnusedBaseInventoryVaccineApi,
  useVaccineApi,
} from "@/lib/businessModules/travelMedicine/api/clients";
import {
  unusedBaseInventoryVaccineApiQueryKey,
  vaccineApiQueryKey,
} from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllVaccinesQuery() {
  const vaccineApi = useVaccineApi();
  return queryOptions({
    queryKey: vaccineApiQueryKey(["getVaccines"]),
    queryFn: () => vaccineApi.getVaccines(),
    select: (response) => response.vaccines ?? [],
  });
}

export function useGetUnusedInventoryVaccinesQuery() {
  const unusedBaseInventoryVaccineApi = useUnusedBaseInventoryVaccineApi();
  return queryOptions({
    queryKey: unusedBaseInventoryVaccineApiQueryKey([
      "getInventoryVaccinesWithoutRmbiVaccine",
    ]),
    queryFn: () =>
      unusedBaseInventoryVaccineApi.getInventoryVaccinesWithoutRmbiVaccine(),
  });
}
