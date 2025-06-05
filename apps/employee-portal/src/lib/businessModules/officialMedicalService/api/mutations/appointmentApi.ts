/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiBookingInfo,
  CancelAppointmentRequest,
} from "@eshg/official-medical-service-api";

import { useOmsAppointmentApi } from "@/lib/businessModules/officialMedicalService/api/clients";

export function useBookAppointment() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useOmsAppointmentApi();

  return useHandledMutation({
    mutationFn: ({
      appointmentId,
      request,
    }: {
      appointmentId: string;
      request: ApiBookingInfo;
    }) => employeeOmsProcedureApi.bookAppointment(appointmentId, request),
    onSuccess: () => snackbar.confirmation("Termin gebucht."),
  });
}

export function useCancelAppointment() {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useOmsAppointmentApi();

  return useHandledMutation({
    mutationFn: (request: CancelAppointmentRequest) =>
      employeeOmsProcedureApi.cancelAppointmentRaw(request),
    onSuccess: () => snackbar.confirmation("Termin abgesagt."),
  });
}

export function useCloseAppointment() {
  return useCloseAppointmentInternal("Termin abgeschlossen.");
}

export function useWithdrawAppointment() {
  return useCloseAppointmentInternal("Terminoption zurückgezogen.");
}

function useCloseAppointmentInternal(successMessage: string) {
  const snackbar = useSnackbar();
  const employeeOmsProcedureApi = useOmsAppointmentApi();

  return useHandledMutation({
    mutationFn: ({ appointmentId }: { appointmentId: string }) =>
      employeeOmsProcedureApi.closeAppointment(appointmentId),
    onSuccess: () => snackbar.confirmation(successMessage),
  });
}
