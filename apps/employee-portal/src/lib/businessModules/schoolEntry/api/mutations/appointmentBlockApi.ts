/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiCreateDailyAppointmentBlockGroupRequest } from "@eshg/school-entry-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/clients";

export function useCreateDailyAppointmentBlocksForGroup() {
  const snackbar = useSnackbar();
  const appointmentBlockApi = useAppointmentBlockApi();
  return useHandledMutation({
    mutationFn: (data: ApiCreateDailyAppointmentBlockGroupRequest) =>
      appointmentBlockApi.createDailyAppointmentBlocksForGroup(data),
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde erfolgreich geplant.");
    },
  });
}
