/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAdminPartialRule,
  ApiStagingStatus,
} from "@eshg/admin-portal-api/serviceDirectory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useAdminApi } from "@/lib/api/clients";
import { TableApi } from "@/lib/components/table/EditableTable";
import { RULES_QUERY, Rule } from "@/lib/hooks/useRules";

const queryKey = RULES_QUERY;

let lock: Promise<void | ApiAdminPartialRule> = Promise.resolve();

function runSequentially(
  fn: () => Promise<ApiAdminPartialRule>,
): Promise<ApiAdminPartialRule> {
  return (lock = lock.then(fn, fn));
}

export function useRulesApi(): {
  api: TableApi<Rule>;
} {
  const adminApi = useAdminApi();

  const queryClient = useQueryClient();

  const handleUpdateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey }),
    [queryClient],
  );

  const create = useMutation({
    mutationFn: (_unused?: string) =>
      adminApi.createRule({
        client: {},
        server: {},
        active: false,
        stagingStatus: ApiStagingStatus.WorkInProgress,
      }),
    onSuccess: handleUpdateSuccess,
  });
  const update = useMutation({
    mutationFn: async (apiAdminRuleRequest: Partial<ApiAdminPartialRule>) => {
      return runSequentially(() => adminApi.updateRule(apiAdminRuleRequest));
    },
    onSuccess: handleUpdateSuccess,
  });
  const deleteAudited = useMutation({
    mutationFn: (id: string) => {
      return adminApi.deleteRuleById(id);
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
      runSequentially(() => adminApi.activateRuleById(id)),
    onSuccess: handleUpdateSuccess,
  });
  const deactivate = useMutation({
    mutationFn: (id: string) =>
      runSequentially(() => adminApi.deactivateRuleById(id)),
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
