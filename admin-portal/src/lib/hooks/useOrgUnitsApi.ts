/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminPartialOrgUnit,
  ApiStagingStatus,
} from "@eshg/admin-portal-api/serviceDirectory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useAdminApi } from "@/lib/api/clients";
import { TableApi } from "@/lib/components/table/EditableTable";
import { ORG_UNITS_QUERY, OrgUnit } from "@/lib/hooks/useOrgUnits";

const queryKey = ORG_UNITS_QUERY;

let lock: Promise<void | ApiAdminPartialOrgUnit> = Promise.resolve();

function runSequentially(
  fn: () => Promise<ApiAdminPartialOrgUnit>,
): Promise<ApiAdminPartialOrgUnit> {
  return (lock = lock.then(fn, fn));
}

export function useOrgUnitsApi(): {
  api: TableApi<OrgUnit>;
} {
  const adminApi = useAdminApi();

  const queryClient = useQueryClient();

  const handleUpdateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient],
  );

  const create = useMutation({
    mutationFn: (_unused?: string) =>
      adminApi.createOrgUnit({
        active: false,
        stagingStatus: ApiStagingStatus.WorkInProgress,
      }),
    onSuccess: handleUpdateSuccess,
  });
  const update = useMutation({
    mutationFn: async (apiAdminOrgUnitRequest: ApiAdminPartialOrgUnit) =>
      runSequentially(() => adminApi.updateOrgUnit(apiAdminOrgUnitRequest)),
    onSuccess: handleUpdateSuccess,
  });
  const deleteAudited = useMutation({
    mutationFn: (id: string) => {
      return adminApi.deleteOrgUnitById(id);
    },
    onSuccess: handleUpdateSuccess,
  });
  const deleteStated = useMutation({
    mutationFn: (id: string) => {
      return adminApi.deleteStaged(undefined, [id]);
    },
    onSuccess: handleUpdateSuccess,
  });
  const activate = useMutation({
    mutationFn: (id: string) =>
      runSequentially(() => adminApi.activateOrgUnitById(id)),
    onSuccess: handleUpdateSuccess,
  });
  const deactivate = useMutation({
    mutationFn: (id: string) =>
      runSequentially(() => adminApi.deactivateOrgUnitById(id)),
    onSuccess: handleUpdateSuccess,
  });

  return {
    api: {
      create: create.mutate,
      update: update.mutate,
      deleteAudited: deleteAudited.mutate,
      deleteStaged: deleteStated.mutate,
      activate: activate.mutate,
      deactivate: deactivate.mutate,
    },
  };
}
