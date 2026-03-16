/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiOmsCreateAssessment,
  UpdateAssessmentContentRequest,
  UpdateAssessmentRecipientRequest,
  UpdateAssessmentResultRequest,
  UpdateAssessmentSummaryRequest,
  UpdateAssessmentTitleAndTypeRequest,
} from "@eshg/official-medical-service-api";

import { useOmsAssessmentApi } from "@/lib/businessModules/officialMedicalService/api/clients";

export function useCreateAssessment() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (request: ApiOmsCreateAssessment) =>
      omsAssessmentApi.createAssessment(request),
    onSuccess: () => snackbar.confirmation("Das Schriftgut wurde angelegt."),
  });
}

export function useDeleteAssessment() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (id: string) => omsAssessmentApi.deleteAssessment(id),
    onSuccess: () => snackbar.confirmation("Das Schriftgut wurde gelöscht."),
  });
}

export function useUpdateAssessmentSummary() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (request: UpdateAssessmentSummaryRequest) =>
      omsAssessmentApi.updateAssessmentSummaryRaw(request),
    onSuccess: () =>
      snackbar.confirmation("Die Zusammenfassung wurde gespeichert."),
  });
}

export function useUpdateAssessmentResult() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (request: UpdateAssessmentResultRequest) =>
      omsAssessmentApi.updateAssessmentResultRaw(request),
    onSuccess: () => snackbar.confirmation("Das Ergebnis wurde gespeichert."),
  });
}

export function useUpdateAssessmentTitleAndType() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (request: UpdateAssessmentTitleAndTypeRequest) =>
      omsAssessmentApi.updateAssessmentTitleAndTypeRaw(request),
    onSuccess: () => snackbar.confirmation("Die Angaben wurden gespeichert."),
  });
}

export function useUpdateAssessmentStatusToFinished() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (id: string) =>
      omsAssessmentApi.updateAssessmentStatusToFinished(id),
    onSuccess: () => snackbar.confirmation("Schriftgut Fertig"),
  });
}

export function useUpdateAssessmentStatusToPublished() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (id: string) =>
      omsAssessmentApi.updateAssessmentStatusToPublished(id),
    onSuccess: () => snackbar.confirmation("Schriftgut Fertig - Übermittelt"),
  });
}

export function useUpdateAssessmentStatusToOpen() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (id: string) =>
      omsAssessmentApi.updateAssessmentStatusToOpen(id),
    onSuccess: () => snackbar.confirmation("Schriftgut Offen"),
  });
}

export function useUpdateAssessmentContent() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (request: UpdateAssessmentContentRequest) =>
      omsAssessmentApi.updateAssessmentContentRaw(request),
    onSuccess: () => snackbar.confirmation("Inhalt gespeichert"),
  });
}

export function useUpdateAssessmentRecipient() {
  const snackbar = useSnackbar();
  const omsAssessmentApi = useOmsAssessmentApi();

  return useHandledMutation({
    mutationFn: (request: UpdateAssessmentRecipientRequest) =>
      omsAssessmentApi.updateAssessmentRecipientRaw(request),
    onSuccess: () => snackbar.confirmation("Ansprechperson gespeichert"),
  });
}
