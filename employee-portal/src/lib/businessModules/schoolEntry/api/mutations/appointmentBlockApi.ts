/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiCreateDailyAppointmentBlockGroupRequest,
  DeleteAppointmentBlockRequest,
} from "@eshg/school-entry-api";
import { MutationOptions, useMutation } from "@tanstack/react-query";

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

export function useDeleteAppointmentBlockOptions(): MutationOptions<
  void,
  Error,
  DeleteAppointmentBlockRequest
> {
  const appointmentBlockGroupsApi = useAppointmentBlockApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: ({ appointmentBlockId }: DeleteAppointmentBlockRequest) =>
      appointmentBlockGroupsApi.deleteAppointmentBlock(appointmentBlockId),
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde erfolgreich gelöscht.");
    },
    onError: () => {
      snackbar.error("Der Terminblock konnte nicht gelöscht werden.");
    },
  };
}

export function useDeleteAppointmentBlock() {
  const deleteAppointmentBlockOptions = useDeleteAppointmentBlockOptions();

  return useMutation(deleteAppointmentBlockOptions);
}
