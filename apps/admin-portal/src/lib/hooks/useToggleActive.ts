/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useAdminApi } from "@/lib/api/clients";
import { isActor, isOrgUnit, isRule } from "@/lib/helpers/entityValidation";
import { ENTITIES_QUERY, EntityWrapper } from "@/lib/hooks/useEntities";
import { runSequentially } from "@/lib/hooks/useUpdateEntity";

export function useToggleActive() {
  const adminApi = useAdminApi();

  const queryClient = useQueryClient();

  const handleUpdateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY }),
    [queryClient],
  );

  const { mutate } = useMutation({
    mutationFn: (entity: EntityWrapper) =>
      runSequentially(() => {
        if (isOrgUnit(entity)) {
          if (entity.entity?.active)
            return adminApi.deactivateOrgUnitById(entity.id);
          else return adminApi.activateOrgUnitById(entity.id);
        } else if (isActor(entity)) {
          if (entity.entity?.active)
            return adminApi.deactivateActorById(entity.id);
          else return adminApi.activateActorById(entity.id);
        } else if (isRule(entity)) {
          if (entity.entity?.active)
            return adminApi.deactivateRuleById(entity.id);
          else return adminApi.activateRuleById(entity.id);
        } else {
          throw new Error("Unexpected entity type");
        }
      }),
    onSuccess: handleUpdateSuccess,
  });

  return mutate;
}
