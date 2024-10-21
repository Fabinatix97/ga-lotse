/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateProcedureRequest,
  ApiCreateProcedureResponse,
  ApiStiProtectionProcedure,
} from "@eshg/employee-portal-api/stiProtection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

import { MutationPassThrough } from "./types";

export function useCreateStiProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  ApiCreateProcedureResponse,
  ApiCreateProcedureRequest
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
}: MutationPassThrough<ApiStiProtectionProcedure, string> = {}) {
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
}: MutationPassThrough<ApiStiProtectionProcedure, string> = {}) {
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
}: MutationPassThrough<ApiStiProtectionProcedure, string> = {}) {
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
}: MutationPassThrough<ApiStiProtectionProcedure, string> = {}) {
  const snackbar = useSnackbar();
  return useReopenProcedureMutation({
    onSuccess(data, variables, context) {
      onSuccess?.(data, variables, context);
      snackbar.confirmation("Vorgang wird wieder geöffnet");
    },
    onError,
  });
}
