/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationPassThrough, useHandledMutation } from "@eshg/lib-portal";
import {
  ApiCreateProstituteProtectionProcedureRequest,
  ApiCreateProstituteProtectionProcedureResponse,
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
