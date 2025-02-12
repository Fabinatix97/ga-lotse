/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import {
  ApiCreateAppointmentRequest,
  ApiCreateFollowUpProcedureRequest,
  ApiCreateFollowUpProcedureResponse,
  ApiCreateProcedureRequest,
  ApiCreateProcedureResponse,
  ApiUpdateAppointmentRequest,
  ApiUpdatePersonDetailsRequest,
  CancelAppointmentRequest,
} from "@eshg/sti-protection-api";
import { MutationOptions } from "@tanstack/react-query";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useCreateStiProcedureOptions({
  onSuccess,
  onError,
}: MutationPassThrough<
  ApiCreateProcedureRequest,
  ApiCreateProcedureResponse
> = {}): MutationOptions<
  ApiCreateProcedureResponse,
  Error,
  ApiCreateProcedureRequest
> {
  const api = useStiProtectionProcedureApi();
  return {
    mutationFn: (data: ApiCreateProcedureRequest) => api.createProcedure(data),
    mutationKey: stiProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  };
}

export function useCreateStiProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  ApiCreateProcedureRequest,
  ApiCreateProcedureResponse
> = {}) {
  const options = useCreateStiProcedureOptions({ onSuccess, onError });
  return useHandledMutation(options);
}

export function useCloseProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<string, void> = {}) {
  const api = useStiProtectionProcedureApi();
  return useHandledMutation({
    mutationFn: (id: string) => api.closeProcedure(id),
    mutationKey: stiProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useCloseProcedure({
  onSuccess,
  onError,
}: MutationPassThrough<string, void> = {}) {
  const snackbar = useSnackbar();
  return useCloseProcedureMutation({
    onSuccess(data, variables, context) {
      onSuccess?.(data, variables, context);
      snackbar.confirmation("Vorgang wird abgeschlossen");
    },
    onError,
  });
}

export function useReopenProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<string, void> = {}) {
  const api = useStiProtectionProcedureApi();
  return useHandledMutation({
    mutationFn: (id: string) => api.reopenProcedure(id),
    mutationKey: stiProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useReopenProcedure({
  onSuccess,
  onError,
}: MutationPassThrough<string, void> = {}) {
  const snackbar = useSnackbar();
  return useReopenProcedureMutation({
    onSuccess(data, variables, context) {
      onSuccess?.(data, variables, context);
      snackbar.confirmation("Vorgang wird wieder geöffnet");
    },
    onError,
  });
}

interface CreateFollowUpProcedureParams {
  id: string;
  data: ApiCreateFollowUpProcedureRequest;
}

export function useCreateStiFollowUpProcedureOptions({
  onSuccess,
  onError,
}: MutationPassThrough<
  CreateFollowUpProcedureParams,
  ApiCreateFollowUpProcedureResponse
> = {}): MutationOptions<
  ApiCreateFollowUpProcedureResponse,
  Error,
  CreateFollowUpProcedureParams
> {
  const api = useStiProtectionProcedureApi();
  return {
    mutationFn: ({ id, data }: CreateFollowUpProcedureParams) =>
      api.createFollowUpProcedure(id, data),
    mutationKey: stiProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  };
}

export function useCreateStiFollowUpProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  CreateFollowUpProcedureParams,
  ApiCreateFollowUpProcedureResponse
> = {}) {
  const options = useCreateStiFollowUpProcedureOptions({ onSuccess, onError });
  return useHandledMutation(options);
}

interface UpdatePersonDetailsParams {
  id: string;
  data: ApiUpdatePersonDetailsRequest;
}

export function useUpdatePersonDetailsMutation({
  onSuccess,
  onError,
}: MutationPassThrough<UpdatePersonDetailsParams, void> = {}) {
  const api = useStiProtectionProcedureApi();

  return useHandledMutation({
    mutationFn: ({ id, data }: UpdatePersonDetailsParams) =>
      api.updatePersonDetails(id, data),
    mutationKey: stiProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useUpdatePersonDetails({
  onSuccess,
  onError,
}: MutationPassThrough<UpdatePersonDetailsParams, void> = {}) {
  return useUpdatePersonDetailsMutation({
    onSuccess(data, variables, context) {
      onSuccess?.(data, variables, context);
    },
    onError,
  });
}

interface CreateAppointmentParams {
  id: string;
  data: ApiCreateAppointmentRequest;
}

export function useCreateAppointmentMutation({
  onSuccess,
  onError,
}: MutationPassThrough<CreateAppointmentParams, void> = {}) {
  const api = useStiProtectionProcedureApi();

  return useHandledMutation({
    mutationFn: ({ id, data }: CreateAppointmentParams) =>
      api.createAppointment(id, data),
    mutationKey: stiProtectionApiQueryKey(["appointment", "create"]),
    onSuccess,
    onError,
  });
}

export function useCancelAppointmentMutation({
  onSuccess,
  onError,
}: MutationPassThrough<CancelAppointmentRequest, void> = {}) {
  const api = useStiProtectionProcedureApi();

  return useHandledMutation({
    mutationFn: ({ id }: CancelAppointmentRequest) => api.cancelAppointment(id),
    mutationKey: stiProtectionApiQueryKey(["appointment", "cancel"]),
    onSuccess,
    onError,
  });
}

interface UpdateAppointmentParams {
  id: string;
  data: ApiUpdateAppointmentRequest;
}

export function useEditAppointmentMutation({
  onSuccess,
  onError,
}: MutationPassThrough<UpdateAppointmentParams, void> = {}) {
  const api = useStiProtectionProcedureApi();

  return useHandledMutation({
    mutationFn: ({ id, data }: UpdateAppointmentParams) =>
      api.updateAppointment(id, data),
    mutationKey: stiProtectionApiQueryKey(["appointment", "update"]),
    onSuccess,
    onError,
  });
}
