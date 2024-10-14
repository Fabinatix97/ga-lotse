/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminPartialActor,
  ApiStagingStatus,
} from "@eshg/admin-portal-api/serviceDirectory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useAdminApi } from "@/lib/api/clients";
import { TableApi } from "@/lib/components/table/EditableTable";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import { ORG_UNITS_QUERY } from "@/lib/hooks/useOrgUnits";

const queryKey = ORG_UNITS_QUERY;

export function useActorsApi(): {
  api: TableApi<Actor>;
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
    mutationFn: (orgUnitId?: string) =>
      adminApi.createActor({
        orgUnitId,
        active: false,
        manualCertificate: false,
        stagingStatus: ApiStagingStatus.WorkInProgress,
      }),
    onSuccess: handleCreateSuccess,
  });
  const update = useMutation({
    mutationFn: (apiAdminActorRequest: ApiAdminPartialActor) =>
      adminApi.updateActor(apiAdminActorRequest),
    onSuccess: handleUpdateSuccess,
  });
  const deleteAudited = useMutation({
    mutationFn: (id: string) => adminApi.deleteActorById(id),
    onSuccess: handleDeleteAuditedSuccess,
  });
  const deleteStaged = useMutation({
    mutationFn: (id: string) => adminApi.deleteStaged(undefined, [id]),
    onSuccess: handleDeleteStagedSuccess,
  });

  return {
    api: {
      create: create.mutate,
      update: update.mutate,
      deleteAudited: deleteAudited.mutate,
      deleteStaged: deleteStaged.mutate,
    },
  };
}
