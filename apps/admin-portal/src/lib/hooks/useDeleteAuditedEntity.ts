/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useAdminApi } from "@/lib/api/clients";
import { isActor, isOrgUnit, isRule } from "@/lib/helpers/entityValidation";
import { ENTITIES_QUERY, EntityWrapper } from "@/lib/hooks/useEntities";

export function useDeleteAuditedEntity() {
  const adminApi = useAdminApi();

  const queryClient = useQueryClient();

  const handleUpdateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY }),
    [queryClient],
  );

  const { mutate } = useMutation({
    mutationFn: (entity: EntityWrapper) => {
      if (isOrgUnit(entity)) {
        return adminApi.deleteOrgUnitById(entity.id);
      } else if (isActor(entity)) {
        return adminApi.deleteActorById(entity.id);
      } else if (isRule(entity)) {
        return adminApi.deleteRuleById(entity.id);
      } else {
        throw new Error("Unexpected entity type");
      }
    },
    onSuccess: handleUpdateSuccess,
  });

  return mutate;
}
