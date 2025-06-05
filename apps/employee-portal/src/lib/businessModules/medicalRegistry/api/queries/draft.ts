/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { ApiGetProcedureDraftResponse } from "@eshg/medical-registry-api";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";
import {
  DraftConfirmInfo,
  mapConfirmInfoResponse,
} from "@/lib/businessModules/medicalRegistry/api/model/confirmInfo";
import { medicalRegistryApiQueryKey } from "@/lib/businessModules/medicalRegistry/api/queries/apiQueryKeys";

export function useGetConfirmInfo(procedure: ApiGetProcedureDraftResponse) {
  const medicalRegistryApi = useMedicalRegistryApi();
  return useQuery<DraftConfirmInfo>({
    queryKey: medicalRegistryApiQueryKey(["getConfirmInfo", procedure.id]),
    queryFn: async () => {
      return medicalRegistryApi
        .getConfirmInfo(procedure.id)
        .then(mapConfirmInfoResponse);
    },
    // query is intended to be triggered by refetch
    enabled: false,
  });
}
