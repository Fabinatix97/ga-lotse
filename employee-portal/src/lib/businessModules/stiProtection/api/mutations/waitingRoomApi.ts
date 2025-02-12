/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import { UpdateWaitingRoomDetailsRequest } from "@eshg/sti-protection-api";

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
