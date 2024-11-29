/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetEvaluationsRequest } from "@eshg/employee-portal-api/statistics";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useDataSourceApi,
  useEvaluationApi,
  useEvaluationTemplateApi,
} from "@/lib/businessModules/statistics/api/clients";
import { createQueryGetAvailableDataSources } from "@/lib/businessModules/statistics/api/queries/useGetAvailableDataSources";
import { createQueryGetEvaluationTemplates } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplates";
import { createQueryGetEvaluations } from "@/lib/businessModules/statistics/api/queries/useGetEvaluations";

export function useGetEvaluationsOverview(
  evaluationsRequest: GetEvaluationsRequest,
) {
  const evaluationsApi = useEvaluationApi();
  const dataSourceApi = useDataSourceApi();
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const [
    { data: evaluationsOverview, isFetching: evaluationsOverviewIsFetching },
    { data: availableDataSources },
    { data: evaluationTemplates },
  ] = useSuspenseQueries({
    queries: [
      createQueryGetEvaluations(evaluationsApi, evaluationsRequest),
      createQueryGetAvailableDataSources(dataSourceApi),
      createQueryGetEvaluationTemplates(evaluationTemplateApi),
    ],
  });

  return {
    evaluationsOverview,
    evaluationsOverviewIsFetching,
    availableDataSources,
    evaluationTemplates,
  };
}
