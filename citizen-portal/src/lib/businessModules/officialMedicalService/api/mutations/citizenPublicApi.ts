/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { PostCitizenProcedureRequest } from "@eshg/official-medical-service-api";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { useTranslation } from "@/lib/i18n/client";

export function usePostCitizenProcedure() {
  const citizenPublicApi = useCitizenPublicApi();
  const snackbar = useSnackbar();
  const { t } = useTranslation(["officialMedicalService/appointment"]);

  return useHandledMutation({
    mutationFn: (request: PostCitizenProcedureRequest) => {
      return citizenPublicApi
        .postCitizenProcedureRaw(request)
        .then(unwrapRawResponse);
    },
    onSuccess: () => {
      snackbar.confirmation(t("common.snackbar.success"));
    },
  });
}
