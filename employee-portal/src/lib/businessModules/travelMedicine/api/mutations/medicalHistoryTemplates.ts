/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiPatchMedicalHistoryTemplateFlagRequest,
  ApiPostPutMedicalHistoryTemplateRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

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
