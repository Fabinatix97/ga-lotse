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

export function useOrgUnitsApi(): {
  api: TableApi<OrgUnit>;
} {
  const adminApi = useAdminApi();

  const queryClient = useQueryClient();

  const handleCreateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient],
  );
  const handleUpdateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient],
  );
  const handleDeleteAuditedSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient],
  );
  const handleDeleteStagedSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient],
  );

  const create = useMutation({
    mutationFn: (_unused?: string) =>
      adminApi.createOrgUnit({
        active: false,
        stagingStatus: ApiStagingStatus.WorkInProgress,
      }),
    onSuccess: handleCreateSuccess,
  });
  const update = useMutation({
    mutationFn: (apiAdminOrgUnitRequest: ApiAdminPartialOrgUnit) =>
      adminApi.updateOrgUnit(apiAdminOrgUnitRequest),
    onSuccess: handleUpdateSuccess,
  });
  const deleteAudited = useMutation({
    mutationFn: (id: string) => {
      return adminApi.deleteOrgUnitById(id);
    },
    onSuccess: handleDeleteAuditedSuccess,
  });
  const deleteStated = useMutation({
    mutationFn: (id: string) => {
      return adminApi.deleteStaged(undefined, [id]);
    },
    onSuccess: handleDeleteStagedSuccess,
  });

  return {
    api: {
      create: create.mutate,
      update: update.mutate,
      deleteAudited: deleteAudited.mutate,
      deleteStaged: deleteStated.mutate,
    },
  };
}
