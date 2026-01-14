/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";
import { ApiCreateDailyAppointmentBlockGroupRequest } from "@eshg/measles-protection-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export function useCreateDailyAppointmentBlocksForGroup() {
  const appointmentBlockGroupsApi = useAppointmentBlockApi();
  const snackbar = useSnackbar();
  return useMutation({
    mutationFn: (request: ApiCreateDailyAppointmentBlockGroupRequest) =>
      appointmentBlockGroupsApi.createDailyAppointmentBlocksForGroup(request),
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde erfolgreich geplant.");
    },
    onError: () => {
      snackbar.error("Der Terminblock konnte nicht angelegt werden.");
    },
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
  });
}
