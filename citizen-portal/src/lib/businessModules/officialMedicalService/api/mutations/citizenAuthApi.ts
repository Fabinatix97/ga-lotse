/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  CancelAppointmentByCitizenRequest,
  PostDocumentCitizenRequest,
  PutAppointmentCitizenRequest,
} from "@eshg/official-medical-service-api";

import { useCitizenAuthApi } from "@/lib/businessModules/officialMedicalService/api/clients";
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

  return useHandledMutation({
    mutationFn: (request: PutAppointmentCitizenRequest) => {
      return citizenAuthApi
        .putAppointmentCitizenRaw(request)
        .then(unwrapRawResponse);
    },
    onSuccess: () => {
      snackbar.confirmation(successMsg);
    },
  });
}

export function usePostDocumentCitizen() {
  const citizenAuthApi = useCitizenAuthApi();
  const snackbar = useSnackbar();
  const { t } = useTranslation(["officialMedicalService/personalArea"]);

  return useHandledMutation({
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
