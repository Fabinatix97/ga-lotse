/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateMedicalHistoryRequest } from "@eshg/employee-portal-api/stiProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useMedicalHistoryApi } from "@/lib/businessModules/stiProtection/api/clients";
import { proceduresQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useUpsertMedicalHistoryOptions(
  procedureId: string,
): MutationOptions<void, Error, ApiCreateMedicalHistoryRequest> {
  const medicalHistoryApi = useMedicalHistoryApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: (medicalHistory: ApiCreateMedicalHistoryRequest) =>
      medicalHistoryApi.updateMedicalHistory(procedureId, medicalHistory),
    mutationKey: proceduresQueryKey([procedureId, "medicalHistory"]),
    onSuccess: () => {
      snackbar.confirmation("Die Anamnese wurde erfolgreich gespeichert.");
    },
    onError: () => {
      snackbar.error("Die Anamnese konnte nicht gespeichert werden.");
    },
  };
}

export function useUpsertMedicalHistory(procedureId: string) {
  const options = useUpsertMedicalHistoryOptions(procedureId);
  return useMutation(options);
}
