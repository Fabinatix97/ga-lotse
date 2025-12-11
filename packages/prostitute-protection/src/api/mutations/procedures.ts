/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationPassThrough, useHandledMutation } from "@eshg/lib-portal";
import {
  type ApiAbortProcedureRequest,
  ApiCreateProstituteProtectionProcedureRequest,
  ApiCreateProstituteProtectionProcedureResponse,
  type ApiProcedureDetails,
} from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

export function useCreateProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  ApiCreateProstituteProtectionProcedureRequest,
  ApiCreateProstituteProtectionProcedureResponse
> = {}) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  return useHandledMutation({
    onSuccess,
    onError,
    mutationFn: (req: ApiCreateProstituteProtectionProcedureRequest) =>
      prostituteProtectionApi.createProcedure(req),
  });
}

export interface AbortProcedureParams {
  id: string;
  data: ApiAbortProcedureRequest;
}

export function useAbortProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<AbortProcedureParams, ApiProcedureDetails> = {}) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  return useHandledMutation({
    onSuccess,
    onError,
    mutationFn: ({ id, data }: AbortProcedureParams) =>
      prostituteProtectionApi.abortProcedure(id, data),
  });
}
