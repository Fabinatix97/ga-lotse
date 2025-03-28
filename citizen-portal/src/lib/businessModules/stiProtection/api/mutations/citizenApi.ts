/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiCreateMedicalHistoryRequest } from "@eshg/sti-protection-api";
import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useCitizenApi } from "@/lib/businessModules/stiProtection/api/clients";
import { useTranslation } from "@/lib/i18n/client";

export function useUpsertMedicalHistoryOptions(): MutationOptions<
  void,
  Error,
  ApiCreateMedicalHistoryRequest
> {
  const { t } = useTranslation(["stiProtection/forms"]);
  const citizenApi = useCitizenApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: (medicalHistory: ApiCreateMedicalHistoryRequest) =>
      citizenApi.updateCitizenMedicalHistory(medicalHistory),
    onSuccess: () => {
      snackbar.confirmation(t("anamnesis.submit_success"));
    },
    onError: () => {
      snackbar.error(t("anamnesis.submit_error"));
    },
  };
}

export function useUpsertMedicalHistory() {
  const options = useUpsertMedicalHistoryOptions();

  return useMutation(options);
}
