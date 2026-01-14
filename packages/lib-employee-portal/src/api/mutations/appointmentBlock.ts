/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import {
  AppointmentBlockApi,
  DeleteAppointmentBlockRequest,
  UpdateAppointmentBlockRequest,
} from "../AppointmentBlockApi";

export function useUpdateAppointmentBlock(
  appointmentBlockApi: AppointmentBlockApi,
) {
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: (
      updateAppointmentBlockRequest: UpdateAppointmentBlockRequest,
    ) =>
      appointmentBlockApi.updateAppointmentBlock(updateAppointmentBlockRequest),
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde erfolgreich bearbeitet.");
    },
  });
}

export function useDeleteAppointmentBlock(
  appointmentBlockApi: AppointmentBlockApi,
) {
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: ({ appointmentBlockId }: DeleteAppointmentBlockRequest) =>
      appointmentBlockApi.deleteAppointmentBlock({ appointmentBlockId }),
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde erfolgreich gelöscht.");
    },
    onError: () => {
      snackbar.error("Der Terminblock konnte nicht gelöscht werden.");
    },
  });
}
