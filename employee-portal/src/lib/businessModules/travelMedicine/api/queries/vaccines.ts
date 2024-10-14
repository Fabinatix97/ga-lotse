/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import { queryOptions } from "@tanstack/react-query";

import {
  useUnusedBaseInventoryVaccineApi,
  useVaccineApi,
} from "@/lib/businessModules/travelMedicine/api/clients";
import { mapVaccines } from "@/lib/businessModules/travelMedicine/api/models/Vaccines";
import {
  unusedBaseInventoryVaccineApiQueryKey,
  vaccineApiQueryKey,
} from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllVaccinesQuery() {
  const vaccineApi = useVaccineApi();
  return queryOptions({
    queryKey: vaccineApiQueryKey(["getVaccines"]),
    queryFn: () => vaccineApi.getVaccines(),
  });
}

export function useGetAllVaccinesUnsuspended(open: boolean) {
  const vaccineApi = useVaccineApi();
  return useHandledBackgroundQuery({
    queryKey: vaccineApiQueryKey(["getVaccines"]),
    queryFn: () => vaccineApi.getVaccines(),
    select: (response) => response.vaccines.map(mapVaccines),
    enabled: open,
    gcTime: 60000,
    staleTime: 60000,
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
