/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUpdateReferencePersonRequest } from "@eshg/base-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useApi } from "../../../contexts/api";

export function useUpdateReferencePerson() {
  const { personApi } = useApi();
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
