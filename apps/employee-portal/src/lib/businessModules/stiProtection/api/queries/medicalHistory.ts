/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useMedicalHistoryApi } from "@/lib/businessModules/stiProtection/api/clients";

import { proceduresQueryKey } from "./apiQueryKeys";

function useGetMedicalHistoryQueryOptions(procedureId: string) {
  const medicalHistoryApi = useMedicalHistoryApi();

  return queryOptions({
    queryFn: ({ signal }) =>
      medicalHistoryApi
        .getMedicalHistory(procedureId, {
          signal,
        })
        .then((response) => {
          return response;
        })
        .catch((_error: Error) => {
          return null;
        }),
    queryKey: proceduresQueryKey([procedureId, "medicalHistory"]),
  });
}

export function useMedicalHistoryQuery(procedureId: string) {
  return useSuspenseQuery(useGetMedicalHistoryQueryOptions(procedureId));
}
