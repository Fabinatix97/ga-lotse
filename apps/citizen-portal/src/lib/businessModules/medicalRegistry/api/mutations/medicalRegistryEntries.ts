/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import { CreateProcedureRequest } from "@eshg/medical-registry-api";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import { useTranslation } from "@/lib/i18n/client";

export function useCreateProcedure() {
  const medicalRegistryApi = useMedicalRegistryApi();
  const snackbar = useSnackbar();
  const { t } = useTranslation([
    "medicalRegistry/professionalRegistrationForm",
  ]);

  return useHandledMutation({
    mutationFn: (req: CreateProcedureRequest) =>
      medicalRegistryApi
        .createProcedureFromCitizenPortalRaw(req)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation(t("snackbar.success"));
    },
  });
}
