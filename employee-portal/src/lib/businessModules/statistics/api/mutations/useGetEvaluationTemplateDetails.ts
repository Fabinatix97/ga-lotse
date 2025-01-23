/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { mapToEvaluationTemplateDetails } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplateDetails";

export function useGetEvaluationTemplateDetails() {
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const mutation = useHandledMutation({
    mutationFn: (evaluationTemplateId: string) =>
      evaluationTemplateApi
        .getEvaluationTemplate(evaluationTemplateId)
        .then(mapToEvaluationTemplateDetails),
  });

  return async (evaluationTemplateId: string) => {
    return mutation.mutateAsync(evaluationTemplateId);
  };
}
