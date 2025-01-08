/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DeleteAppointmentEpRequest,
  PatchAppointmentRequest,
  PatchEarliestDateRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useProcedureStepApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function usePatchAppointment() {
  const snackbar = useSnackbar();
  const procedureStepApi = useProcedureStepApi();

  return useHandledMutation({
    mutationFn: (request: PatchAppointmentRequest) =>
      procedureStepApi.patchAppointmentRaw(request).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der Termin wurde geändert.");
    },
  });
}

export function usePatchEarliestDate() {
  const snackbar = useSnackbar();
  const procedureStepApi = useProcedureStepApi();

  return useHandledMutation({
    mutationFn: (request: PatchEarliestDateRequest) =>
      procedureStepApi.patchEarliestDateRaw(request).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("'Buchbar ab' wurde gespeichert.");
    },
  });
}

export function useDeleteAppointmentEp() {
  const snackbar = useSnackbar();
  const procedureStepApi = useProcedureStepApi();

  return useHandledMutation({
    mutationFn: (request: DeleteAppointmentEpRequest) =>
      procedureStepApi.deleteAppointmentEpRaw(request).then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der Termin wurde abgesagt.");
    },
  });
}
