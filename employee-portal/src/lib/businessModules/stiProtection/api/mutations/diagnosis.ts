/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDiagnosis } from "@eshg/employee-portal-api/stiProtection";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import { useMutation } from "@tanstack/react-query";

import { useDiagnosisApi } from "@/lib/businessModules/stiProtection/api/clients";
import { proceduresQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useUpsertDiagnosis(
  procedureId: string,
  passThrough: MutationPassThrough<ApiDiagnosis, void>,
) {
  const api = useDiagnosisApi();
  return useMutation({
    mutationFn: (consultation) =>
      api.updateDiagnosis(procedureId, consultation),
    mutationKey: proceduresQueryKey([procedureId, "diagnosis"]),
    ...passThrough,
  });
}
