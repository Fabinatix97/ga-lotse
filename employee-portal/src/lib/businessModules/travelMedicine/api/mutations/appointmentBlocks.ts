/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateDailyAppointmentBlockGroupRequest } from "@eshg/employee-portal-api/travelMedicine";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useAppointmentBlockApi } from "@/lib/businessModules/travelMedicine/api/clients";

export function useCreateDailyAppointmentBlocksForGroup() {
  const snackbar = useSnackbar();
  const appointmentBlockApi = useAppointmentBlockApi();
  return useHandledMutation({
    mutationFn: (data: ApiCreateDailyAppointmentBlockGroupRequest) => {
      return appointmentBlockApi.createDailyAppointmentBlocksForGroup(data);
    },
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde angelegt.");
    },
  });
}
