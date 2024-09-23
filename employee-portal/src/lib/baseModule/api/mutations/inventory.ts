/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddInventoryItemRequest,
  ApiUpdateInventoryItemCountRequest,
  ApiUpdateInventoryItemRequest,
} from "@eshg/employee-portal-api/base";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useInventoryApi } from "@/lib/baseModule/api/clients";

export function useAddInventoryItem() {
  const inventoryApi = useInventoryApi();

  return useHandledMutation({
    mutationFn: async (request: ApiAddInventoryItemRequest) => {
      return await inventoryApi.addInventoryItem(request);
    },
  });
}

export function useUpdateInventoryItem(id: string) {
  const inventoryApi = useInventoryApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: ApiUpdateInventoryItemRequest) =>
      inventoryApi.updateInventoryItem(id, request),
    onSuccess: () => {
      snackbar.confirmation("Inventar wurde erfolgreich geändert");
    },
  });
}

export function useRestockInventoryItem(id: string) {
  const inventoryApi = useInventoryApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (count: number) =>
      inventoryApi.restockInventoryItem(id, { restockingCount: count }),
    onSuccess: () => {
      snackbar.confirmation("Inventar wurde erfolgreich aufgefüllt");
    },
  });
}

export function useCorrectInventoryItemCount(id: string) {
  const inventoryApi = useInventoryApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: ApiUpdateInventoryItemCountRequest) =>
      inventoryApi.updateInventoryItemCount(id, request),
    onSuccess: () => {
      snackbar.confirmation("Bestand wurde erfolgreich korrigiert");
    },
  });
}
