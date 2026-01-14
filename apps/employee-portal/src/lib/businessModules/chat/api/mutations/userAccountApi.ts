/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import {
  ApiBindKeycloakIdRequest,
  ApiDeactivateRequest,
} from "@eshg/chat-management-api";
import { useSnackbar } from "@eshg/lib-portal";

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

export function useDeactivateUserAccount() {
  const userAccountApi = useUserAccountApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: (request: ApiDeactivateRequest) =>
      userAccountApi.deactivateUserAccount(request),
    onError: () => {
      snackbar.error("Etwas ist schief gelaufen");
    },
  });
}
