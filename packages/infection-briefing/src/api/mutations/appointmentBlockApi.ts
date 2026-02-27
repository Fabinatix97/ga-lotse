/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCreateDailyAppointmentBlockGroupRequest } from "@eshg/infection-briefing-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useInfectionBriefingApiClients } from "../../contexts/InfectionBriefingApi";

export function useCreateDailyAppointmentBlocksForGroup() {
  const snackbar = useSnackbar();
  const { appointmentBlockApi } = useInfectionBriefingApiClients();
  return useHandledMutation({
    mutationFn: (data: ApiCreateDailyAppointmentBlockGroupRequest) =>
      appointmentBlockApi.createDailyAppointmentBlocksForGroup(data),
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde erfolgreich geplant.");
    },
  });
}
