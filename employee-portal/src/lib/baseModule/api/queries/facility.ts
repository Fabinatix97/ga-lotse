/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useFacilityApi } from "@/lib/baseModule/api/clients";
import { facilityApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetFacilityFileStateDiff(id: string) {
  const facilityApi = useFacilityApi();
  return useSuspenseQuery({
    queryKey: facilityApiQueryKey(["getFacilityFileStateDiff", id]),
    queryFn: () => facilityApi.getFacilityDiff(id),
  });
}
