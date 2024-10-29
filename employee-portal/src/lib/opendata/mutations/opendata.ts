/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiUpdateVersionMetaDataRequest,
  CreateOpenDocumentRequest,
} from "@eshg/employee-portal-api/opendata";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useOpenDataApi } from "@/lib/opendata/api/clients";

export function usePostOpenDocument() {
  const openDataApi = useOpenDataApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (request: CreateOpenDocumentRequest) =>
      openDataApi.createOpenDocumentRaw(request),
    onSuccess: () =>
      snackbar.confirmation("Der Datensatz wurde erfolgreich angelegt."),
    onError: () =>
      snackbar.error("Der Datensatz konnte nicht angelegt werden."),
  });
}

export function useDeleteVersion() {
  const openDataApi = useOpenDataApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: ({ versionId }: { versionId: string }) =>
      openDataApi.deleteVersion(versionId),
    onSuccess: () =>
      snackbar.confirmation("Der Datensatz wurde erfolgreich gelöscht."),
    onError: () =>
      snackbar.error("Der Datensatz konnte nicht gelöscht werden."),
  });
}

export function useUpdateVersionMetadata() {
  const openDataApi = useOpenDataApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: ({
      versionId,
      request,
    }: {
      versionId: string;
      request: ApiUpdateVersionMetaDataRequest;
    }) => openDataApi.updateVersionMetadata(versionId, request),
    onSuccess: () =>
      snackbar.confirmation("Der Datensatz wurde erfolgreich aktualisiert."),
    onError: () =>
      snackbar.error("Der Datensatz konnte nicht aktualisiert werden."),
  });
}
