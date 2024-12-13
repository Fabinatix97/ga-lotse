/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateAppointmentRequest,
  ApiCreateProcedureRequest,
  ApiCreateProcedureResponse,
  ApiStiProtectionProcedure,
  ApiUpdateAppointmentRequest,
  ApiUpdatePersonDetailsRequest,
  CancelAppointmentRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useCreateStiProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  ApiCreateProcedureRequest,
  ApiCreateProcedureResponse
> = {}) {
  const api = useStiProtectionProcedureApi();
  return useHandledMutation({
    mutationFn: (data: ApiCreateProcedureRequest) => api.createProcedure(data),
    mutationKey: stiProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useCloseProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<string, ApiStiProtectionProcedure> = {}) {
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
}: MutationPassThrough<string, ApiStiProtectionProcedure> = {}) {
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
}: MutationPassThrough<string, ApiStiProtectionProcedure> = {}) {
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
}: MutationPassThrough<string, ApiStiProtectionProcedure> = {}) {
  const snackbar = useSnackbar();
  return useReopenProcedureMutation({
    onSuccess(data, variables, context) {
      onSuccess?.(data, variables, context);
      snackbar.confirmation("Vorgang wird wieder geöffnet");
    },
    onError,
  });
}

interface UpdatePersonDetailsParams {
  id: string;
  data: ApiUpdatePersonDetailsRequest;
}

export function useUpdatePersonDetailsMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  UpdatePersonDetailsParams,
  ApiStiProtectionProcedure
> = {}) {
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
}: MutationPassThrough<
  UpdatePersonDetailsParams,
  ApiStiProtectionProcedure
> = {}) {
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
