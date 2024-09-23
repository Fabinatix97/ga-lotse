/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
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

export function useRulesApi(): {
  api: TableApi<Rule>;
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
      adminApi.createRule({
        client: {},
        server: {},
        active: false,
        stagingStatus: ApiStagingStatus.WorkInProgress,
      }),
    onSuccess: handleCreateSuccess,
  });
  const update = useMutation({
    mutationFn: (apiAdminRuleRequest: ApiAdminPartialRule) =>
      adminApi.updateRule(apiAdminRuleRequest),
    onSuccess: handleUpdateSuccess,
  });
  const deleteAudited = useMutation({
    mutationFn: (id: string) => {
      return adminApi.deleteRuleById(id);
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
