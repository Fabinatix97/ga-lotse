/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddGdprProcedureFromCitizenPortalRequest } from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

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
