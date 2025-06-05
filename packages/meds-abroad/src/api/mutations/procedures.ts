/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationPassThrough, useHandledMutation } from "@eshg/lib-portal";
import {
  ApiCreateMedsAbroadProcedureRequest,
  ApiCreateMedsAbroadProcedureResponse,
} from "@eshg/meds-abroad-api";

import { useMedsAbroadApiClients } from "../../contexts/MedsAbroadApi";

export function useCreateProcedureMutation({
  onSuccess,
  onError,
}: MutationPassThrough<
  ApiCreateMedsAbroadProcedureRequest,
  ApiCreateMedsAbroadProcedureResponse
> = {}) {
  const { MedsAbroadApi } = useMedsAbroadApiClients();
  return useHandledMutation({
    onSuccess,
    onError,
    mutationFn: (req: ApiCreateMedsAbroadProcedureRequest) =>
      MedsAbroadApi.createMedsAbroadProcedure(req),
  });
}
