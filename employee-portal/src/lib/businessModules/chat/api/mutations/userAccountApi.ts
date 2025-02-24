/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBindKeycloakIdRequest } from "@eshg/chat-management-api";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useMutation } from "@tanstack/react-query";

import { useUserAccountApi } from "@/lib/businessModules/chat/api/clients";

export function useBindKeycloakId() {
  const userAccountApi = useUserAccountApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: (request: ApiBindKeycloakIdRequest) =>
      userAccountApi.bindKeycloakId(request),
    onError: () => {
      snackbar.error("Etwas ist schief gelaufen");
    },
  });
}
