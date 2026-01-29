/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";
import { type ApiCreateCitizenProcedureRequest } from "@eshg/prostitute-protection-api";

import { useProstituteProtectionCitizenPublicApi } from "@/lib/businessModules/prostituteProtection/api/clients";
import { useTranslation } from "@/lib/i18n/client";

export function useBookAppointment() {
  const api = useProstituteProtectionCitizenPublicApi();
  const { t } = useTranslation(["prostituteProtection/forms"]);
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: (appointment: ApiCreateCitizenProcedureRequest) =>
      api.createCitizenProcedure(appointment),
    onSuccess: () => {
      snackbar.confirmation(t("submit_success"));
    },
    onError: () => {
      snackbar.error(t("submit_error"));
    },
  });
}
