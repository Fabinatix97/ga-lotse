/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { ApiStagingStatus } from "@eshg/service-directory-api";

import { useAdminApi } from "@/lib/api/clients";
import { ENTITIES_QUERY } from "@/lib/hooks/useEntities";

export function useCreateEntity() {
  const adminApi = useAdminApi();
  const path = usePathname();

  const queryClient = useQueryClient();

  const handleUpdateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY }),
    [queryClient],
  );

  const { mutate } = useMutation({
    mutationFn: async (orgUnitId?: string) => {
      switch (path) {
        case "/org-units":
          await adminApi.createOrgUnit({
            active: false,
            stagingStatus: ApiStagingStatus.WorkInProgress,
          });
          break;
        case "/actors":
          await adminApi.createActor({
            orgUnitId,
            active: false,
            manualCertificate: false,
            stagingStatus: ApiStagingStatus.WorkInProgress,
          });
          break;
        case "/rules":
          await adminApi.createRule({
            client: {},
            server: {},
            active: false,
            stagingStatus: ApiStagingStatus.WorkInProgress,
          });
          break;
        default:
          throw new Error("Unexpected entity type");
      }
    },
    onSuccess: handleUpdateSuccess,
  });

  return mutate;
}
