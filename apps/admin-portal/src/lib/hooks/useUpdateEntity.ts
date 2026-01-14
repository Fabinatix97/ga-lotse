/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  ApiAdminPartialActor,
  ApiAdminPartialOrgUnit,
  ApiAdminPartialRule,
} from "@eshg/service-directory-api";

import { useAdminApi } from "@/lib/api/clients";
import { isActor, isOrgUnit, isRule } from "@/lib/helpers/entityValidation";
import {
  ENTITIES_QUERY,
  EntityWrapper,
  canonicalColumnId,
} from "@/lib/hooks/useEntities";

let lock: Promise<
  void | ApiAdminPartialOrgUnit | ApiAdminPartialActor | ApiAdminPartialRule
> = Promise.resolve();

export function runSequentially(
  fn: () => Promise<
    ApiAdminPartialOrgUnit | ApiAdminPartialActor | ApiAdminPartialRule
  >,
): Promise<
  ApiAdminPartialOrgUnit | ApiAdminPartialActor | ApiAdminPartialRule
> {
  return (lock = lock.then(fn, fn));
}

export function useUpdateEntity() {
  const adminApi = useAdminApi();

  const queryClient = useQueryClient();

  const { mutate: updateOrgUnit } = useMutation({
    mutationFn: (apiAdminPartialOrgUnit: ApiAdminPartialOrgUnit) =>
      runSequentially(() => adminApi.updateOrgUnit(apiAdminPartialOrgUnit)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY }),
  });

  const { mutate: updateActor } = useMutation({
    mutationFn: (apiAdminPartialActor: ApiAdminPartialActor) =>
      runSequentially(() => adminApi.updateActor(apiAdminPartialActor)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY }),
  });

  const { mutate: updateRule } = useMutation({
    mutationFn: (apiAdminPartialRule: ApiAdminPartialRule) =>
      runSequentially(() => adminApi.updateRule(apiAdminPartialRule)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY }),
  });

  return useCallback(
    (
      entity: EntityWrapper,
      update?: Record<string, string | boolean | null | undefined | object>,
    ) => {
      const updatedEntity = { id: entity.id };
      if (update) {
        for (const [key, value] of Object.entries(update)) {
          Object.assign(updatedEntity, { [canonicalColumnId(key)]: value });
        }
      } else {
        Object.assign(updatedEntity, entity.entity);
      }
      if (isOrgUnit(entity)) {
        return updateOrgUnit(updatedEntity);
      }
      if (isActor(entity)) {
        return updateActor(updatedEntity);
      }
      if (isRule(entity)) {
        return updateRule(updatedEntity);
      }
      throw new Error("Unexpected entity type");
    },
    [updateOrgUnit, updateActor, updateRule],
  );
}
