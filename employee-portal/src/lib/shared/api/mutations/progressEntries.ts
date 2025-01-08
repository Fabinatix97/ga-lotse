/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiApprovalRequest,
  ApiCreateApprovalRequestRequest,
  ApiCreateManualProgressEntryRequest,
  ApiFileMetaData,
  ApiGetFile200Response,
  ApiManualProgressEntry,
  ApiPatchManualProgressEntryRequest,
  ApiUpdateFileMetaDataRequest,
} from "@eshg/employee-portal-api/businessProcedures";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { isDefined } from "remeda";

import { useProgressEntriesConfig } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";

export function useCreateProgressEntryTemplate(
  useProgressEntryApi: () => {
    addProgressEntry: (
      procedureId: string,
      createManualProgressEntryRequest: ApiCreateManualProgressEntryRequest,
      file?: Blob,
      fileMetaData?: ApiFileMetaData,
    ) => Promise<ApiManualProgressEntry>;
  },
  mutationKey?: readonly string[],
) {
  const progressEntryApi = useProgressEntryApi();
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
    mutationKey,
  });
}

export function useDeleteProgressEntryTemplate(
  useProgressEntryApi: () => {
    removeProgressEntry: (
      procedureId: string,
      progressEntryId: string,
    ) => Promise<void>;
  },
  mutationKey?: readonly string[],
) {
  const progressEntryApi = useProgressEntryApi();
  const { procedureId } = useProgressEntriesConfig();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: async (entryId: string) => {
      return await progressEntryApi.removeProgressEntry(procedureId, entryId);
    },
    onSuccess: () => {
      snackbar.confirmation("Verlaufseintrag erfolgreich gelöscht.");
    },
    mutationKey,
  });
}

export function usePatchProgressEntryTemplate(
  useProgressEntryApi: () => {
    patchProgressEntry: (
      procedureId: string,
      progressEntryId: string,
      apiPatchManualProgressEntryRequest: ApiPatchManualProgressEntryRequest,
    ) => Promise<ApiManualProgressEntry>;
  },
  useFileApi: () => {
    updateFileMetaData: (
      fileId: string,
      apiUpdateFileMetaDataRequest: ApiUpdateFileMetaDataRequest,
    ) => Promise<ApiGetFile200Response>;
  },
  mutationKey?: readonly string[],
) {
  const progressEntryApi = useProgressEntryApi();
  const fileApi = useFileApi();
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
    mutationKey,
    onSuccess: () =>
      snackbar.confirmation("Verlaufseintrag erfolgreich bearbeitet."),
  });
}

export function useRequestProgressEntryDeletionTemplate(
  useProgressEntryApi: () => {
    requestProgressEntryDeletion(
      procedureId: string,
      progressEntryId: string,
      apiCreateApprovalRequestRequest: ApiCreateApprovalRequestRequest,
    ): Promise<ApiApprovalRequest>;
  },
  mutationKey?: readonly string[],
) {
  const progressEntryApi = useProgressEntryApi();
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
    mutationKey,
    onSuccess: () =>
      snackbar.confirmation("Löschanfrage erfolgreich gesendet."),
  });
}
