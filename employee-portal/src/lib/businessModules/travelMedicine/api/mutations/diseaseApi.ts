/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPostPutDiseaseRequest } from "@eshg/employee-portal-api/travelMedicine";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useDiseaseApi } from "@/lib/businessModules/travelMedicine/api/clients";

export interface PutDiseaseRequest {
  id: string;
  request: ApiPostPutDiseaseRequest;
}

export function usePostDisease() {
  const snackbar = useSnackbar();
  const diseaseApi = useDiseaseApi();

  return useHandledMutation({
    mutationFn: (data: ApiPostPutDiseaseRequest) => {
      return diseaseApi.postDisease(data);
    },
    onSuccess: () => {
      snackbar.confirmation("Erfolgreich gespeichert.");
    },
  });
}

export function usePutDisease() {
  const snackbar = useSnackbar();
  const diseaseApi = useDiseaseApi();

  return useHandledMutation({
    mutationFn: (data: PutDiseaseRequest) => {
      return diseaseApi.putDisease(data.id, data.request);
    },
    onSuccess: () => {
      snackbar.confirmation("Erfolgreich gespeichert.");
    },
  });
}

export function useDeleteDisease() {
  const snackbar = useSnackbar();
  const diseaseApi = useDiseaseApi();

  return useHandledMutation({
    mutationFn: (id: string) => {
      return diseaseApi.deleteDisease(id);
    },
    onSuccess: () => {
      snackbar.confirmation("Erfolgreich gelöscht.");
    },
  });
}
