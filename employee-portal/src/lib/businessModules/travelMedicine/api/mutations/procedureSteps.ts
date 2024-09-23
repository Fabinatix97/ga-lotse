/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPatchAppointmentRequest } from "@eshg/employee-portal-api/travelMedicine";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useProcedureStepApi } from "@/lib/businessModules/travelMedicine/api/clients";

export interface PatchAppointmentRequest {
  procedureStepId: string;
  apiPatchAppointmentRequest: ApiPatchAppointmentRequest;
}

export function usePatchAppointment() {
  const snackbar = useSnackbar();
  const procedureStepApi = useProcedureStepApi();

  return useHandledMutation({
    mutationFn: (request: PatchAppointmentRequest) =>
      procedureStepApi.patchAppointment(
        request.procedureStepId,
        request.apiPatchAppointmentRequest,
      ),
    onSuccess: () => {
      snackbar.confirmation("Termin erfolgreich geändert.");
    },
  });
}
