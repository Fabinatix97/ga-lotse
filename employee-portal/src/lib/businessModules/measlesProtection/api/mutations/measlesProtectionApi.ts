/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { BookAppointmentForProcedureRequest } from "@eshg/measles-protection-api";

import { useAppointmentBookingApi } from "@/lib/businessModules/measlesProtection/api/clients";

export function useBookAppointmentForProcedure() {
  const appointmentBookingApi = useAppointmentBookingApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: BookAppointmentForProcedureRequest) =>
      appointmentBookingApi
        .bookAppointmentForProcedureRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Der Termin wurde erfolgreich gebucht.");
    },
  });
}
