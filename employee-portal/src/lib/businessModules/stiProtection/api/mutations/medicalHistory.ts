/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateMedicalHistoryRequest } from "@eshg/employee-portal-api/stiProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useMutation } from "@tanstack/react-query";

import { useMedicalHistoryApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionProceduresApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useUpsertMedicalHistory() {
  const medicalHistoryApi = useMedicalHistoryApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: ({
      id,
      medicalHistory,
    }: {
      id: string;
      medicalHistory: ApiCreateMedicalHistoryRequest;
    }) => medicalHistoryApi.updateMedicalHistory(id, medicalHistory),
    onSuccess: () => {
      snackbar.confirmation("Die Anamnese wurde erfolgreich gespeichert.");
    },
    onError: () => {
      snackbar.error("Die Anamnese konnte nicht gespeichert werden.");
    },
    mutationKey: stiProtectionProceduresApiQueryKey(["medicalHistory"]),
  });
}
