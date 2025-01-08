/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPatchMedicalHistoryRequest } from "@eshg/employee-portal-api/travelMedicine";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useMedicalHistoryApi } from "@/lib/businessModules/travelMedicine/api/clients";

export interface PatchMedicalHistoryRequest {
  medicalHistoryId: string;
  request: ApiPatchMedicalHistoryRequest;
}

export function usePatchMedicalHistory() {
  const snackbar = useSnackbar();
  const medicalHistoryApi = useMedicalHistoryApi();

  return useHandledMutation({
    mutationFn: (data: PatchMedicalHistoryRequest) => {
      return medicalHistoryApi.patchMedicalHistory(
        data.medicalHistoryId,
        data.request,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Der Anamnesebogen wurde gespeichert.");
    },
  });
}
