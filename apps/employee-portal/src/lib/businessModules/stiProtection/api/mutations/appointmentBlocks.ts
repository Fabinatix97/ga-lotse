/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiCreateAppointmentBlockGroupResponse,
  ApiCreateDailyAppointmentBlockGroupRequest,
  DeleteAppointmentBlockRequest,
} from "@eshg/sti-protection-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/stiProtection/api/clients";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useCreateDailyAppointmentBlocksForGroupOptions(): MutationOptions<
  ApiCreateAppointmentBlockGroupResponse,
  Error,
  ApiCreateDailyAppointmentBlockGroupRequest
> {
  const appointmentBlockGroupsApi = useAppointmentBlockApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: (request: ApiCreateDailyAppointmentBlockGroupRequest) =>
      appointmentBlockGroupsApi.createDailyAppointmentBlocksForGroup(request),
    onSuccess: () => {
      snackbar.confirmation("Der Terminblock wurde erfolgreich geplant.");
    },
    onError: () => {
      snackbar.error("Der Terminblock konnte nicht angelegt werden.");
    },
    mutationKey: appointmentBlockApiQueryKey(["appointmentBlockGroups"]),
  };
}

export function useCreateDailyAppointmentBlocksForGroup() {
  const createDailyAppointmentBlocksForGroupOptions =
    useCreateDailyAppointmentBlocksForGroupOptions();
  return useMutation(createDailyAppointmentBlocksForGroupOptions);
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
    mutationKey: appointmentBlockApiQueryKey(["appointmentBlockGroups"]),
  };
}

export function useDeleteAppointmentBlock() {
  const deleteAppointmentBlockOptions = useDeleteAppointmentBlockOptions();

  return useMutation(deleteAppointmentBlockOptions);
}
