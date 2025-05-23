/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { BookAppointmentForProcedureRequest } from "@eshg/measles-protection-api";

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
