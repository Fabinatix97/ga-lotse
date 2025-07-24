/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { ApiStagingStatus } from "@eshg/service-directory-api";

import { useAdminApi } from "@/lib/api/clients";
import { ENTITIES_QUERY, OrgUnit } from "@/lib/hooks/useEntities";

export function useCreateEntity() {
  const adminApi = useAdminApi();
  const path = usePathname();

  const queryClient = useQueryClient();

  const handleUpdateSuccess = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ENTITIES_QUERY }),
    [queryClient],
  );

  const { mutate } = useMutation({
    mutationFn: async (orgUnit?: OrgUnit) => {
      switch (path) {
        case "/org-units":
          await adminApi.createOrgUnit({
            active: false,
            stagingStatus: ApiStagingStatus.WorkInProgress,
          });
          break;
        case "/actors":
          await adminApi.createActor({
            orgUnitId: orgUnit?.id,
            active: false,
            manualCertificate: false,
            stagingStatus: ApiStagingStatus.WorkInProgress,
          });
          break;
        case "/rules":
          const selector = orgUnit?.entity
            ? {
                federalState: orgUnit.entity.federalState,
                orgUnitName: orgUnit.entity.readableName,
                orgUnitType: orgUnit.entity.type,
              }
            : {};
          await adminApi.createRule({
            client: selector,
            server: selector,
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
