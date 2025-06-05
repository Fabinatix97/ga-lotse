/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiPatchMedicalHistoryTemplateFlagRequest,
  ApiPostPutMedicalHistoryTemplateRequest,
} from "@eshg/travel-medicine-api";

import { useMedicalHistoryTemplateApi } from "@/lib/businessModules/travelMedicine/api/clients";

export interface PutMedicalHistoryTemplateRequest {
  id: string;
  request: ApiPostPutMedicalHistoryTemplateRequest;
}

export interface PatchMedicalHistoryTemplateFlagRequest {
  id: string;
  request: ApiPatchMedicalHistoryTemplateFlagRequest;
}

export function usePostMedicalHistoryTemplate() {
  const snackbar = useSnackbar();
  const medicalHistoryTemplateApi = useMedicalHistoryTemplateApi();

  return useHandledMutation({
    mutationFn: (data: ApiPostPutMedicalHistoryTemplateRequest) => {
      return medicalHistoryTemplateApi.postMedicalHistoryTemplate(data);
    },
    onSuccess: () => {
      snackbar.confirmation("Der Anamnesebogen wurde gespeichert.");
    },
  });
}

export function usePutMedicalHistoryTemplate() {
  const snackbar = useSnackbar();
  const medicalHistoryTemplateApi = useMedicalHistoryTemplateApi();

  return useHandledMutation({
    mutationFn: (data: PutMedicalHistoryTemplateRequest) => {
      return medicalHistoryTemplateApi.putMedicalHistoryTemplate(
        data.id,
        data.request,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Die Anamnesevorlage wurde gespeichert.");
    },
  });
}

export function useDeleteMedicalHistoryTemplateById() {
  const snackbar = useSnackbar();
  const medicalHistoryTemplateApi = useMedicalHistoryTemplateApi();

  return useHandledMutation({
    mutationFn: (id: string) => {
      return medicalHistoryTemplateApi.deleteMedicalHistoryTemplateById(id);
    },
    onSuccess: () => {
      snackbar.confirmation("Die Anamnesevorlage wurde gelöscht.");
    },
  });
}

export function usePatchMedicalHistoryTemplateMainFlag() {
  const snackbar = useSnackbar();
  const medicalHistoryTemplateApi = useMedicalHistoryTemplateApi();

  return useHandledMutation({
    mutationFn: (data: PatchMedicalHistoryTemplateFlagRequest) => {
      return medicalHistoryTemplateApi.patchMedicalHistoryTemplateMainFlag(
        data.id,
        data.request,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Die Anamnesevorlage wurde gespeichert.");
    },
  });
}

export function usePatchMedicalHistoryTemplateFollowUpFlag() {
  const snackbar = useSnackbar();
  const medicalHistoryTemplateApi = useMedicalHistoryTemplateApi();

  return useHandledMutation({
    mutationFn: (data: PatchMedicalHistoryTemplateFlagRequest) => {
      return medicalHistoryTemplateApi.patchMedicalHistoryTemplateFollowUpFlag(
        data.id,
        data.request,
      );
    },
    onSuccess: () => {
      snackbar.confirmation("Die Anamnesevorlage wurde gespeichert.");
    },
  });
}
