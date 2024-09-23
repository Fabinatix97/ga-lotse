/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserSettingsRequest } from "@eshg/employee-portal-api/chatManagement";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useMutation } from "@tanstack/react-query";

import { useUserSettingsApi } from "@/lib/businessModules/chat/api/clients";

export function useCreateOrUpdateUserSettings() {
  const userSettingsApi = useUserSettingsApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: (request: ApiUserSettingsRequest) =>
      userSettingsApi.createOrUpdateUserSettings(request),
    onSuccess: () => {
      snackbar.confirmation("Benutzereinstellungen wurden geändert");
    },
    onError: () => {
      snackbar.error("Etwas ist schief gelaufen");
    },
  });
}

export function useUpdateConsentUserSettings() {
  const userSettingsApi = useUserSettingsApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: (request: ApiUserSettingsRequest) =>
      userSettingsApi.createOrUpdateUserSettings(request),
    onError: () => {
      snackbar.error("Etwas ist schief gelaufen");
    },
  });
}
