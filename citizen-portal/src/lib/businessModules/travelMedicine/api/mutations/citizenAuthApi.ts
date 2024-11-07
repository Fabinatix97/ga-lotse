/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointment,
  ApiDocumentContent,
  DeleteAppointmentCpRequest,
} from "@eshg/citizen-portal-api/travelMedicine";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useCitizenAuthApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useTranslation } from "@/lib/i18n/client";

export interface PatchMedicalHistoryRequest {
  procedureId: string;
  procedureStepId: string;
  medicalHistory: ApiDocumentContent;
}

export function usePatchCitizenMedicalHistory() {
  const { t } = useTranslation(["travelMedicine/medicalHistories"]);
  const citizenAuthApi = useCitizenAuthApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (data: PatchMedicalHistoryRequest) => {
      return citizenAuthApi.patchCitizenMedicalHistory(
        data.procedureId,
        data.procedureStepId,
        data.medicalHistory,
      );
    },
    onSuccess: () => {
      snackbar.confirmation(t("snackbar.patchMedicalHistoryConfirmation"));
    },
  });
}

export function useDeleteAppointmentCp() {
  const { t } = useTranslation(["travelMedicine/appointmentDetails"]);
  const citizenAuthApi = useCitizenAuthApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (data: DeleteAppointmentCpRequest) =>
      citizenAuthApi.deleteAppointmentCpRaw(data).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation(t("snackbar.cancelAppointmentConfirmation"));
    },
  });
}

export interface PutAppointmentRequest {
  procedureId: string;
  procedureStepId: string;
  appointment: ApiAppointment;
}

export function usePutAppointment() {
  const { t } = useTranslation(["travelMedicine/rebookAppointment"]);
  const citizenAuthApi = useCitizenAuthApi();
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (data: PutAppointmentRequest) => {
      return citizenAuthApi.putAppointment(
        data.procedureId,
        data.procedureStepId,
        data.appointment,
      );
    },
    onSuccess: () => {
      snackbar.confirmation(t("snackbar.putAppointmentConfirmation"));
    },
  });
}
