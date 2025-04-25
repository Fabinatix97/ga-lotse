/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { ApiUserSettingsRequest } from "@eshg/chat-management-api";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

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
