/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddResourceRequest,
  ApiUpdateResourceRequest,
} from "@eshg/employee-portal-api/base";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useResourceApi } from "@/lib/baseModule/api/clients";

export function useAddResource() {
  const resourceApi = useResourceApi();

  return useHandledMutation({
    mutationFn: async (request: ApiAddResourceRequest) => {
      return await resourceApi.addResource(request);
    },
  });
}

export function useUpdateResource(id: string) {
  const resourceApi = useResourceApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async (request: ApiUpdateResourceRequest) => {
      await resourceApi.updateResource(id, request);
    },
    onSuccess: () => {
      snackbar.confirmation("Änderungen erfolgreich gespeichert");
    },
  });
}
