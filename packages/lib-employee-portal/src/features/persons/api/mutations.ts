/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUpdateReferencePersonRequest } from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

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
