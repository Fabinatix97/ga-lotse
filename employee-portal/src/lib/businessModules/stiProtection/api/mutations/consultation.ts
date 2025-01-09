/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConsultation } from "@eshg/employee-portal-api/stiProtection";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import { useMutation } from "@tanstack/react-query";

import { useConsultationApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionProceduresApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useUpsertConsultation(
  procedureId: string,
  passThrough: MutationPassThrough<ApiConsultation, void>,
) {
  const api = useConsultationApi();
  return useMutation({
    mutationFn: (consultation) =>
      api.updateConsultation(procedureId, consultation),
    mutationKey: stiProtectionProceduresApiQueryKey([procedureId]),
    ...passThrough,
  });
}
