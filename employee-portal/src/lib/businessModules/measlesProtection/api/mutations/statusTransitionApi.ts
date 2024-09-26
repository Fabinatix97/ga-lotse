/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useStatusTransitionApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { MutationPassThrough } from "@/lib/businessModules/measlesProtection/api/mutations/types";
import { measlesProtectionApiQueryKey } from "@/lib/businessModules/measlesProtection/api/queries/apiQueryKeys";

export interface UseCloseProcedureRequest {
  procedureId: string;
}

export interface UseReopenProcedureRequest {
  procedureId: string;
}

export function useCloseProcedure({
  onSuccess,
  onError,
}: MutationPassThrough<void, UseCloseProcedureRequest> = {}) {
  const statusTransitionApi = useStatusTransitionApi();

  return useHandledMutation({
    mutationFn: (request: UseCloseProcedureRequest) =>
      statusTransitionApi.close(request.procedureId),
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}

export function useReopenProcedure({
  onSuccess,
  onError,
}: MutationPassThrough<void, UseReopenProcedureRequest> = {}) {
  const statusTransitionApi = useStatusTransitionApi();

  return useHandledMutation({
    mutationFn: (request: UseReopenProcedureRequest) =>
      statusTransitionApi.reopen(request.procedureId),
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}
