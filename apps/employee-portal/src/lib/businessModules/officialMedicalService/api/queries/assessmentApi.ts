/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useOmsAssessmentApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { assessmentApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function useGetAllAssessments(procedureId: string) {
  const omsAssessmentApi = useOmsAssessmentApi();
  return queryOptions({
    queryKey: assessmentApiQueryKey([
      "getAssessmentsByProcedureExternalId",
      procedureId,
    ]),
    queryFn: () =>
      omsAssessmentApi.getAssessmentsByProcedureExternalId(procedureId),
    select: (response) => response.assessmentDtos,
  });
}

export function useGetAssessment(AssessmentId: string) {
  const omsAssessmentApi = useOmsAssessmentApi();
  return queryOptions({
    queryKey: assessmentApiQueryKey([
      "getAssessmentByExternalId",
      AssessmentId,
    ]),
    queryFn: () => omsAssessmentApi.getAssessmentByExternalId(AssessmentId),
  });
}
