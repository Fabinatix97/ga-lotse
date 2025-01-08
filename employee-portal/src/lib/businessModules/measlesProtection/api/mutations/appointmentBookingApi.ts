/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BookAppointmentForProcedureRequest } from "@eshg/employee-portal-api/measlesProtection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useAppointmentBookingApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export function useBookAppointmentForProcedure() {
  const appointmentBookingApi = useAppointmentBookingApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: BookAppointmentForProcedureRequest) =>
      appointmentBookingApi.bookAppointmentForProcedure(
        request.procedureId,
        request.apiBookAppointmentRequest,
      ),
    onSuccess: () => {
      snackbar.confirmation("Der Termin wurde erfolgreich gebucht.");
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
  });
}

export function useDeleteAppointmentForProcedure() {
  const appointmentBookingApi = useAppointmentBookingApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (procedureId: string) =>
      appointmentBookingApi.deleteAppointmentForProcedure(procedureId),
    onSuccess: () => {
      snackbar.confirmation("Der Termin wurde erfolgreich gelöscht.");
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
  });
}
