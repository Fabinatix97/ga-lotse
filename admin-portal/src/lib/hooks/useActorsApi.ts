/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminPartialActor,
  ApiStagingStatus,
} from "@eshg/service-directory-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useAdminApi } from "@/lib/api/clients";
import { TableApi } from "@/lib/components/table/EditableTable";
import { Actor } from "@/lib/components/view/actors/ActorTable";
import { ORG_UNITS_QUERY } from "@/lib/hooks/useOrgUnits";

const queryKey = ORG_UNITS_QUERY;

let lock: Promise<void | ApiAdminPartialActor> = Promise.resolve();

function runSequentially(
  fn: () => Promise<ApiAdminPartialActor>,
): Promise<ApiAdminPartialActor> {
  return (lock = lock.then(fn, fn));
}

export function useActorsApi(): {
  api: TableApi<Actor>;
} {
  const adminApi = useAdminApi();

  const queryClient = useQueryClient();

  const handleUpdateSuccess = useCallback(
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
    onSuccess: handleUpdateSuccess,
  });
  const update = useMutation({
    mutationFn: (apiAdminActorRequest: ApiAdminPartialActor) =>
      runSequentially(() => adminApi.updateActor(apiAdminActorRequest)),
    onSuccess: handleUpdateSuccess,
  });
  const deleteAudited = useMutation({
    mutationFn: (id: string) => adminApi.deleteActorById(id),
    onSuccess: handleUpdateSuccess,
  });
  const deleteStaged = useMutation({
    mutationFn: (id: string) => adminApi.deleteStaged(undefined, [id]),
    onSuccess: handleUpdateSuccess,
  });
  const activate = useMutation({
    mutationFn: (id: string) =>
      runSequentially(() => adminApi.activateActorById(id)),
    onSuccess: handleUpdateSuccess,
  });
  const deactivate = useMutation({
    mutationFn: (id: string) =>
      runSequentially(() => adminApi.deactivateActorById(id)),
    onSuccess: handleUpdateSuccess,
  });

  return {
    api: {
      create: create.mutate,
      update: update.mutate,
      deleteAudited: deleteAudited.mutate,
      deleteStaged: deleteStaged.mutate,
      activate: activate.mutate,
      deactivate: deactivate.mutate,
    },
  };
}
