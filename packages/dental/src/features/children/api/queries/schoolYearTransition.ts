/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ChildApi,
  GetSchoolsForSchoolYearTransitionRequest,
} from "@eshg/dental-api";
import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions } from "@tanstack/react-query";

import { childApiQueryKey } from "@/config/apiQueryKeys";
import { mapGroupResult } from "@/features/children/api/models/SchoolYearTransitionGroupResult";
import { mapInstitutionResult } from "@/features/children/api/models/SchoolYearTransitionResult";

export function getSchoolsForTransitionQuery(
  childApi: ChildApi,
  request: GetSchoolsForSchoolYearTransitionRequest,
) {
  return queryOptions({
    queryKey: childApiQueryKey(["getSchoolsForSchoolYearTransition", request]),
    queryFn: () =>
      childApi
        .getSchoolsForSchoolYearTransitionRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapInstitutionResult),
  });
}

export function getGroupsForTransitionQuery(
  childApi: ChildApi,
  institutionId: string,
) {
  return queryOptions({
    queryKey: childApiQueryKey([
      "getGroupsForSchoolYearTransition",
      institutionId,
    ]),
    queryFn: () => childApi.getGroupsForSchoolYearTransition(institutionId),
    select: (response) => response.elements.map(mapGroupResult),
  });
}
