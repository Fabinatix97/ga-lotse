/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  ApiPostAnamnesisRequest,
  CancelAppointmentByCitizenRequest,
  PostDocumentCitizenRequest,
  PutAppointmentCitizenRequest,
} from "@eshg/official-medical-service-api";

import { useCitizenAuthApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { isConcurrentAppointmentError } from "@/lib/businessModules/officialMedicalService/api/helpers";
import { citizenPublicApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";
import { useTranslation } from "@/lib/i18n/client";

export function useCancelAppointmentByCitizen() {
  const citizenAuthApi = useCitizenAuthApi();
  const snackbar = useSnackbar();
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return useHandledMutation({
    mutationFn: (request: CancelAppointmentByCitizenRequest) => {
      return citizenAuthApi
        .cancelAppointmentByCitizenRaw(request)
        .then(unwrapRawResponse);
    },
    onSuccess: () => {
      snackbar.confirmation(t("cancelAppointment.snackbar.success"));
    },
  });
}

export function usePutAppointmentCitizen(successMsg: string) {
  const citizenAuthApi = useCitizenAuthApi();
  const snackbar = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PutAppointmentCitizenRequest) => {
      return citizenAuthApi
        .putAppointmentCitizenRaw(request)
        .then(unwrapRawResponse);
    },
    onSuccess: () => {
      snackbar.confirmation(successMsg);
    },
    onError: async (error) => {
      if (isConcurrentAppointmentError(error)) {
        await queryClient.invalidateQueries({
          queryKey: citizenPublicApiQueryKey(["getFreeAppointmentsForCitizen"]),
        });
      }
    },
  });
}

export function usePostDocumentCitizen() {
  const citizenAuthApi = useCitizenAuthApi();
  const snackbar = useSnackbar();
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return useMutation({
    mutationFn: (request: PostDocumentCitizenRequest) => {
      return citizenAuthApi
        .postDocumentCitizenRaw(request)
        .then(unwrapRawResponse);
    },
    onSuccess: () => {
      snackbar.confirmation(t("documents.snackbar.success"));
    },
  });
}

export function usePostAnamnesisCitizen() {
  const citizenAuthApi = useCitizenAuthApi();
  const snackbar = useSnackbar();
  const { t } = useTranslation(["officialMedicalService/anamnesis"]);

  return useHandledMutation({
    mutationFn: (request: ApiPostAnamnesisRequest) => {
      return citizenAuthApi.postAnamnesisCitizen(request);
    },
    onSuccess: () => {
      snackbar.confirmation(t("snackbar.submit_success"));
    },
  });
}
