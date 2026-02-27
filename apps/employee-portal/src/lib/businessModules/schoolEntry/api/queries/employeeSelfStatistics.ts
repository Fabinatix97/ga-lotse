/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal";
import { GetEmployeeSelfStatisticsRequest } from "@eshg/school-entry-api";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { schoolEntryApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

export function useGetEmployeeSelfStatisticsQuery(
  request: GetEmployeeSelfStatisticsRequest,
) {
  const schoolEntryApi = useSchoolEntryApi();
  return useSuspenseQuery({
    queryKey: schoolEntryApiQueryKey(["getEmployeeSelfStatistics", request]),
    queryFn: () =>
      schoolEntryApi
        .getEmployeeSelfStatisticsRaw(request)
        .then(unwrapRawResponse)
        .then((data) => data.examinationsByWeek),
  });
}
