/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiCreateMedicalHistoryRequest,
  ApiUpdateBookedAppointmentRequest,
  ApiUpdatePinRequest,
} from "@eshg/sti-protection-api";

import { useCitizenApi } from "@/lib/businessModules/stiProtection/api/clients";
import { useTranslation } from "@/lib/i18n/client";

import { returnConflict } from "./helper";

function useUpsertMedicalHistoryOptions(): MutationOptions<
  void,
  Error,
  ApiCreateMedicalHistoryRequest
> {
  const { t } = useTranslation(["stiProtection/forms"]);
  const citizenApi = useCitizenApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: (medicalHistory: ApiCreateMedicalHistoryRequest) =>
      citizenApi.updateCitizenMedicalHistory(medicalHistory),
    onSuccess: () => {
      snackbar.confirmation(t("anamnesis.submit_success"));
    },
    onError: () => {
      snackbar.error(t("anamnesis.submit_error"));
    },
  };
}

export function useUpsertMedicalHistory() {
  const options = useUpsertMedicalHistoryOptions();

  return useMutation(options);
}

export function useCancelBookedAppointment() {
  const citizenApi = useCitizenApi();

  return useHandledMutation({
    mutationFn: () => citizenApi.cancelBookedAppointment(),
  });
}

export function useRebookAppointment() {
  const citizenApi = useCitizenApi();

  return useMutation({
    mutationFn: (appointment: ApiUpdateBookedAppointmentRequest) =>
      citizenApi.updateBookedAppointment(appointment).catch(returnConflict),
  });
}

export function useUpdatePin() {
  const citizenApi = useCitizenApi();

  return useMutation({
    mutationFn: (request: ApiUpdatePinRequest) => citizenApi.updatePin(request),
  });
}
