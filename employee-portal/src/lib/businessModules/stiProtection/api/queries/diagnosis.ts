/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useDiagnosisApi } from "@/lib/businessModules/stiProtection/api/clients";

import { stiProtectionApiQueryKey } from "./apiQueryKeys";

export function useDiagnosisQueryOptions(procedureId: string) {
  const examinationApi = useDiagnosisApi();

  return queryOptions({
    queryFn: ({ signal }) =>
      examinationApi.getDiagnosis(procedureId, { signal }),
    queryKey: stiProtectionApiQueryKey([procedureId, "diagnosis"]),
  });
}
