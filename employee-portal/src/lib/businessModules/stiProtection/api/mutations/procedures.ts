/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateProcedureRequest,
  ApiCreateProcedureResponse,
} from "@eshg/employee-portal-api/stiProtection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

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
