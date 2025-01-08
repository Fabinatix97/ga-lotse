/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";

import { useStatusTransitionApi } from "@/lib/businessModules/measlesProtection/api/clients";
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
}: MutationPassThrough<UseCloseProcedureRequest, void> = {}) {
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
}: MutationPassThrough<UseReopenProcedureRequest, void> = {}) {
  const statusTransitionApi = useStatusTransitionApi();

  return useHandledMutation({
    mutationFn: (request: UseReopenProcedureRequest) =>
      statusTransitionApi.reopen(request.procedureId),
    mutationKey: measlesProtectionApiQueryKey(["procedures"]),
    onSuccess,
    onError,
  });
}
