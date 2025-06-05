/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  unwrapRawResponse,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";
import {
  DeleteAppointmentEpRequest,
  PatchAppointmentRequest,
  PatchEarliestDateRequest,
} from "@eshg/travel-medicine-api";

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
