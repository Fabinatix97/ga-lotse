/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UpdateWaitingRoomDetailsRequest } from "@eshg/employee-portal-api/stiProtection";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";

import { useWaitingRoomApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useUpdateWaitingRoomDetails({
  onSuccess,
}: MutationPassThrough<UpdateWaitingRoomDetailsRequest, void> = {}) {
  const waitingRoomApi = useWaitingRoomApi();
  return useHandledMutation({
    mutationFn: ({
      procedureId,
      apiWaitingRoom,
    }: UpdateWaitingRoomDetailsRequest) =>
      waitingRoomApi.updateWaitingRoomDetails(procedureId, apiWaitingRoom),
    mutationKey: stiProtectionApiQueryKey(["procedures"]),
    onSuccess,
  });
}
