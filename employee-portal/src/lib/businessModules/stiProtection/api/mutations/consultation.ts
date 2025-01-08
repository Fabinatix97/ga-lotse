/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import { useMutation } from "@tanstack/react-query";

import { stiProtectionProceduresApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";
import { ApiConsultation } from "@/lib/businessModules/stiProtection/features/procedures/consultation/helpers";

interface ApiConsultationUpsertRequest {
  id: string;
  consultation: ApiConsultation;
}
export function useUpsertConsultation(
  passThrough: MutationPassThrough<
    ApiConsultationUpsertRequest,
    ApiConsultation
  >,
) {
  return useMutation({
    mutationFn: ({ id: _id, consultation }) => Promise.resolve(consultation),
    mutationKey: stiProtectionProceduresApiQueryKey(["medicalHistory"]),
    ...passThrough,
  });
}
