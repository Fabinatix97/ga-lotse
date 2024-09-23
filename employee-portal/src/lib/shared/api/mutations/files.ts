/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiApprovalRequest,
  ApiCreateApprovalRequestRequest,
} from "@eshg/employee-portal-api/businessProcedures";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

export function useDeleteFileTemplate(
  useFileApi: () => {
    deleteFile: (fileId: string) => Promise<void>;
  },
  mutationKey?: readonly string[],
) {
  const fileApi = useFileApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (fileId: string) => await fileApi.deleteFile(fileId),
    onSuccess: () => {
      snackbar.confirmation("Datei erfolgreich gelöscht.");
    },
    mutationKey,
  });
}

export function useRequestFileDeletionTemplate(
  useFileApi: () => {
    requestFileDeletion: (
      fileId: string,
      apiCreateApprovalRequestRequest: ApiCreateApprovalRequestRequest,
    ) => Promise<ApiApprovalRequest>;
  },
  mutationKey?: readonly string[],
) {
  const fileApi = useFileApi();
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
    mutationKey,
  });
}
