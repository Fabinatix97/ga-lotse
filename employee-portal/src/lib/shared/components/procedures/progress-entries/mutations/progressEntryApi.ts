/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiCreateApprovalRequestRequest,
  ApiCreateManualProgressEntryRequest,
  ApiFileMetaData,
  ApiPatchManualProgressEntryRequest,
  ApiUpdateFileMetaDataRequest,
} from "@eshg/lib-procedures-api";
import { isDefined } from "remeda";

import { useProgressEntriesConfig } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import {
  FileClient,
  ProgressEntryClient,
} from "@/lib/shared/components/procedures/progress-entries/types";

export function useCreateProgressEntry(progressEntryApi: ProgressEntryClient) {
  const { procedureId } = useProgressEntriesConfig();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async ({
      request,
      file,
      fileMetaData,
    }: {
      request: ApiCreateManualProgressEntryRequest;
      file?: File;
      fileMetaData?: ApiFileMetaData;
    }) =>
      progressEntryApi.addProgressEntry(
        procedureId,
        request,
        file,
        fileMetaData,
      ),
    onSuccess: () =>
      snackbar.confirmation("Verlaufseintrag erfolgreich angelegt."),
  });
}

export function useDeleteProgressEntry(progressEntryApi: ProgressEntryClient) {
  const { procedureId } = useProgressEntriesConfig();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (entryId: string) => {
      return await progressEntryApi.removeProgressEntry(procedureId, entryId);
    },
    onSuccess: () => {
      snackbar.confirmation("Verlaufseintrag erfolgreich gelöscht.");
    },
  });
}

export function usePatchProgressEntry(
  progressEntryApi: ProgressEntryClient,
  fileApi: FileClient,
) {
  const { procedureId } = useProgressEntriesConfig();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async ({
      entryId,
      patchProgressEntryRequest,
      fileId,
      updateFileMetaDataRequest,
    }: {
      entryId: string;
      patchProgressEntryRequest?: ApiPatchManualProgressEntryRequest;
      fileId?: string;
      updateFileMetaDataRequest?: ApiUpdateFileMetaDataRequest;
    }) => {
      const [entry, file] = await Promise.all([
        isDefined(patchProgressEntryRequest)
          ? progressEntryApi.patchProgressEntry(
              procedureId,
              entryId,
              patchProgressEntryRequest,
            )
          : undefined,
        isDefined(fileId) && isDefined(updateFileMetaDataRequest)
          ? fileApi.updateFileMetaData(fileId, updateFileMetaDataRequest)
          : undefined,
      ]);
      return { entry, file };
    },
    onSuccess: () =>
      snackbar.confirmation("Verlaufseintrag erfolgreich bearbeitet."),
  });
}

export function useRequestProgressEntryDeletion(
  progressEntryApi: ProgressEntryClient,
) {
  const { procedureId } = useProgressEntriesConfig();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async ({
      entryId,
      createApprovalRequest,
    }: {
      entryId: string;
      createApprovalRequest: ApiCreateApprovalRequestRequest;
    }) => {
      return await progressEntryApi.requestProgressEntryDeletion(
        procedureId,
        entryId,
        createApprovalRequest,
      );
    },
    onSuccess: () =>
      snackbar.confirmation("Löschanfrage erfolgreich gesendet."),
  });
}
