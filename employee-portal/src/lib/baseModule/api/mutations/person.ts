/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUpdateReferencePersonRequest } from "@eshg/base-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { usePersonApi } from "@/lib/baseModule/api/clients";

export function useUpdateReferencePerson() {
  const personApi = usePersonApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: ApiUpdateReferencePersonRequest;
    }) => personApi.updateReferencePerson(id, request),
    onSuccess: () => {
      snackbar.confirmation("Person wurde gespeichert.");
    },
  });
}
