/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateAppointmentBlockGroupRequest } from "@eshg/employee-portal-api/schoolEntry";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/clients";

export function useCreateAppointmentBlockGroup() {
  const appointmentBlockApi = useAppointmentBlockApi();
  const snackbar = useSnackbar();
  return useHandledMutation({
    mutationFn: (request: ApiCreateAppointmentBlockGroupRequest) =>
      appointmentBlockApi.createAppointmentBlockGroup(request),
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde erfolgreich geplant.");
    },
  });
}
