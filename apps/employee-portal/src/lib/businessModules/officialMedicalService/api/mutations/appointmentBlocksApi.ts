/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiCreateDailyAppointmentBlockGroupRequest } from "@eshg/official-medical-service-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/officialMedicalService/api/clients";

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
