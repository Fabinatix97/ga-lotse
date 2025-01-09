/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useConsultationApi } from "@/lib/businessModules/stiProtection/api/clients";

import { stiProtectionApiQueryKey } from "./apiQueryKeys";

export function useConsultationQueryOptions(procedureId: string) {
  const examinationApi = useConsultationApi();

  return queryOptions({
    queryFn: ({ signal }) =>
      examinationApi.getConsultation(procedureId, { signal }),
    queryKey: stiProtectionApiQueryKey([procedureId, "consultation"]),
  });
}

export function useConsultationQuery(procedureId: string) {
  return useSuspenseQuery(useConsultationQueryOptions(procedureId));
}
