/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiCreateApprovalRequestRequest } from "@eshg/lib-procedures-api";

import { FileClient } from "../../types/api";

export function useDeleteFile(fileApi: FileClient) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (fileId: string) => await fileApi.deleteFile(fileId),
    onSuccess: () => {
      snackbar.confirmation("Datei erfolgreich gelöscht.");
    },
  });
}

export function useRequestFileDeletion(fileApi: FileClient) {
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async ({
      fileId,
      createApprovalRequest,
    }: {
      fileId: string;
      createApprovalRequest: ApiCreateApprovalRequestRequest;
    }) => {
      return await fileApi.requestFileDeletion(fileId, createApprovalRequest);
    },
    onSuccess: () =>
      snackbar.confirmation("Löschanfrage erfolgreich gesendet."),
  });
}
