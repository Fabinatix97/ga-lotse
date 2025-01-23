/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddGdprProcedureFromCitizenPortalRequest } from "@eshg/citizen-portal-api/base";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useGdprProcedureApi } from "@/lib/baseModule/api/clients";
import { useTranslation } from "@/lib/i18n/client";

export function useAddGdprProcedure() {
  const gdprApi = useGdprProcedureApi();
  const snackbar = useSnackbar();
  const { t } = useTranslation("gdpr");
  return useHandledMutation({
    mutationFn: (request: ApiAddGdprProcedureFromCitizenPortalRequest) =>
      gdprApi.addGdprProcedureFromCitizenPortal(request),
    onSuccess: (response) => {
      snackbar.confirmation(t(`confirmation.${response.type}`));
    },
  });
}
