/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  useUnusedBaseInventoryVaccineApi,
  useVaccineApi,
} from "@/lib/businessModules/travelMedicine/api/clients";
import {
  unusedBaseInventoryVaccineApiQueryKey,
  vaccineApiQueryKey,
} from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllVaccines() {
  const vaccineApi = useVaccineApi();
  return useSuspenseQuery({
    queryKey: vaccineApiQueryKey(["getVaccines"]),
    queryFn: () => vaccineApi.getVaccines(),
  });
}

export function useGetOneVaccine(id: string) {
  const vaccineApi = useVaccineApi();
  return useSuspenseQuery({
    queryKey: vaccineApiQueryKey(["getVaccine", id]),
    queryFn: () => vaccineApi.getVaccine(id),
  });
}

export function useGetUnusedInventoryVaccines() {
  const unusedBaseInventoryVaccineApi = useUnusedBaseInventoryVaccineApi();
  return useSuspenseQuery({
    queryKey: unusedBaseInventoryVaccineApiQueryKey([
      "getInventoryVaccinesWithoutRmbiVaccine",
    ]),
    queryFn: () =>
      unusedBaseInventoryVaccineApi.getInventoryVaccinesWithoutRmbiVaccine(),
  });
}
