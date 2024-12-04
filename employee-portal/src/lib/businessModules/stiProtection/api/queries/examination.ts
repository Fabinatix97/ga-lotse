/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useExaminationApi } from "@/lib/businessModules/stiProtection/api/clients";

import { stiProtectionApiQueryKey } from "./apiQueryKeys";

function useGetRapidTestExaminationQueryOptions(procedureId: string) {
  const examinationApi = useExaminationApi();

  return queryOptions({
    queryFn: ({ signal }) =>
      examinationApi.getRapidTestExamination(procedureId, { signal }),
    queryKey: stiProtectionApiQueryKey(["rapidTests", procedureId]),
  });
}

export function useGetRapidTestExaminationQuery(procedureId: string) {
  return useSuspenseQuery(useGetRapidTestExaminationQueryOptions(procedureId));
}
