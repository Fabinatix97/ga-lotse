/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPostPutVaccineRequest } from "@eshg/employee-portal-api/travelMedicine";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useVaccineApi } from "@/lib/businessModules/travelMedicine/api/clients";

export interface PostPutVaccineRequest {
  id: string;
  values: ApiPostPutVaccineRequest;
}

export function usePostVaccine() {
  const snackbar = useSnackbar();
  const vaccineApi = useVaccineApi();

  return useHandledMutation({
    mutationFn: (values: ApiPostPutVaccineRequest) =>
      vaccineApi.postVaccine(values),
    onSuccess: () => {
      snackbar.confirmation("Der Impfstoff wurde erstellt.");
    },
  });
}

export function usePutVaccine() {
  const snackbar = useSnackbar();
  const vaccineApi = useVaccineApi();

  return useHandledMutation({
    mutationFn: (wrapper: PostPutVaccineRequest) =>
      vaccineApi.putVaccine(wrapper.id, wrapper.values),
    onSuccess: () => {
      snackbar.confirmation("Der Impfstoff wurde gespeichert.");
    },
  });
}

export function useDeleteVaccine() {
  const snackbar = useSnackbar();
  const vaccineApi = useVaccineApi();

  return useHandledMutation({
    mutationFn: (id: string) => vaccineApi.deleteVaccine(id),
    onSuccess: () => {
      snackbar.confirmation("Der Impfstoff wurde gelöscht.");
    },
  });
}
