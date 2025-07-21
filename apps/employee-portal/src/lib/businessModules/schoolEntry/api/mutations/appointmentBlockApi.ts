/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiCreateDailyAppointmentBlockGroupRequest,
  DeleteAppointmentBlockRequest,
} from "@eshg/school-entry-api";

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

function useDeleteAppointmentBlockOptions(): MutationOptions<
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
  const mutation = useMutation(deleteAppointmentBlockOptions);
  return async (appointmentBlockId: string) =>
    mutation.mutateAsync({ appointmentBlockId });
}
