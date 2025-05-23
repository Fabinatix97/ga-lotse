/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiCreateDailyAppointmentBlockGroupRequest,
  DeleteAppointmentBlockRequest,
} from "@eshg/official-medical-service-api";

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

  return useMutation(deleteAppointmentBlockOptions);
}
