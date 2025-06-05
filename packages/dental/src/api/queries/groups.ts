/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { ApiGetInstitutionGroupsResponse } from "@eshg/dental-api";
import { isBlankString } from "@eshg/lib-portal";

import { childApiQueryKey } from "../../config/apiQueryKeys";
import { useDentalApi } from "../../contexts/dental";

export function useSearchInstitutionGroupsQuery(
  institutionId: string,
  openGroupsOnly: boolean,
) {
  const { childApi } = useDentalApi();

  return useQuery({
    queryKey: childApiQueryKey([
      "getInstitutionGroups",
      institutionId,
      openGroupsOnly,
    ]),
    queryFn: () => childApi.getInstitutionGroups(institutionId, openGroupsOnly),
    select: getGroups,
    enabled: !isBlankString(institutionId),
  });
}

function getGroups(response: ApiGetInstitutionGroupsResponse): string[] {
  return response.groups;
}
