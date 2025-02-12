/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  PatchCompleteDocumentFileUploadRequest,
  PatchDocumentInformationRequest,
  PatchDocumentNoteRequest,
  PatchDocumentReviewRequest,
} from "@eshg/official-medical-service-api";

import { useOmsDocumentApi } from "@/lib/businessModules/officialMedicalService/api/clients";

export function usePatchDocumentInformation() {
  const snackbar = useSnackbar();
  const omsDocumentApi = useOmsDocumentApi();

  return useHandledMutation({
    mutationFn: (request: PatchDocumentInformationRequest) =>
      omsDocumentApi.patchDocumentInformationRaw(request),
    onSuccess: () => {
      snackbar.confirmation("Das Dokument wurde aktualisiert.");
    },
  });
}

export function usePatchCompleteDocumentFileUpload() {
  const snackbar = useSnackbar();
  const omsDocumentApi = useOmsDocumentApi();

  return useHandledMutation({
    mutationFn: (request: PatchCompleteDocumentFileUploadRequest) =>
      omsDocumentApi.patchCompleteDocumentFileUploadRaw(request),
    onSuccess: () => {
      snackbar.confirmation("Das Dokument wurde aktualisiert.");
    },
  });
}

export function useDeleteDocument() {
  const snackbar = useSnackbar();
  const omsDocumentApi = useOmsDocumentApi();

  return useHandledMutation({
    mutationFn: (documentId: string) =>
      omsDocumentApi.deleteDocumentEmployee(documentId),
    onSuccess: () => {
      snackbar.confirmation("Das Dokument wurde gelöscht.");
    },
  });
}

export function usePatchDocumentNote() {
  const snackbar = useSnackbar();
  const omsDocumentApi = useOmsDocumentApi();

  return useHandledMutation({
    mutationFn: (request: PatchDocumentNoteRequest) =>
      omsDocumentApi.patchDocumentNoteRaw(request),
    onSuccess: () => {
      snackbar.confirmation("Die Stichwörter wurden aktualisiert.");
    },
  });
}

export function useReviewDocument() {
  const omsDocumentApi = useOmsDocumentApi();
  return useHandledMutation({
    mutationFn: (request: PatchDocumentReviewRequest) =>
      omsDocumentApi.patchDocumentReviewRaw(request),
  });
}
