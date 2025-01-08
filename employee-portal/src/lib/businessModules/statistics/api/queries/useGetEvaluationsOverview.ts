/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useDataSourceApi,
  useEvaluationApi,
  useEvaluationTemplateApi,
} from "@/lib/businessModules/statistics/api/clients";
import { PageRequest } from "@/lib/businessModules/statistics/api/models/pageRequest";
import { createQueryGetAvailableDataSources } from "@/lib/businessModules/statistics/api/queries/useGetAvailableDataSources";
import { createQueryGetEvaluationTemplates } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationTemplates";
import { createQueryGetEvaluations } from "@/lib/businessModules/statistics/api/queries/useGetEvaluations";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

export function useGetEvaluationsOverview(
  pageRequest: PageRequest,
  filterValues: FilterValue[],
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
      createQueryGetEvaluations(evaluationsApi, pageRequest, filterValues),
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
