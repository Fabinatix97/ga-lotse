/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useAdminApi } from "@/lib/api/clients";
import { ENTITIES_QUERY } from "@/lib/hooks/useEntities";

export function useDeleteStagedEntity() {
  const adminApi = useAdminApi();

  const queryClient = useQueryClient();

  const handleUpdateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY }),
    [queryClient],
  );

  const { mutate } = useMutation({
    mutationFn: (id: string) => adminApi.deleteStaged(undefined, [id]),
    onSuccess: handleUpdateSuccess,
  });

  return mutate;
}
