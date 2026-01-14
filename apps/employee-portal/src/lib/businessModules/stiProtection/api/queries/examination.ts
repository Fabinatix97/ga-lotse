/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useExaminationApi } from "@/lib/businessModules/stiProtection/api/clients";

import { stiProtectionApiQueryKey } from "./apiQueryKeys";

export function useGetRapidTestExaminationQueryOptions(procedureId: string) {
  const examinationApi = useExaminationApi();

  return queryOptions({
    queryFn: ({ signal }) =>
      examinationApi.getRapidTestExamination(procedureId, { signal }),
    queryKey: stiProtectionApiQueryKey([procedureId, "rapidTests"]),
  });
}

function useGetLaboratoryTestExaminationQueryOptions(procedureId: string) {
  const examinationApi = useExaminationApi();

  return queryOptions({
    queryFn: ({ signal }) =>
      examinationApi.getLaboratoryTestExamination(procedureId, { signal }),
    queryKey: stiProtectionApiQueryKey([procedureId, "laboratoryTests"]),
  });
}

export function useGetLaboratoryTestExaminationQuery(procedureId: string) {
  return useSuspenseQuery(
    useGetLaboratoryTestExaminationQueryOptions(procedureId),
  );
}
