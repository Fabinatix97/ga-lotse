/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { InspectionSampleApi } from "@eshg/inspection-api";

import { useSampleApi } from "@/lib/businessModules/inspection/api/clients";
import { samplesApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

export function useGetSamples(inspectionId: string) {
  const sampleApi = useSampleApi();
  return useSuspenseQuery(getSamplesQuery(sampleApi, inspectionId));
}

export function getSamplesQuery(
  sampleApi: InspectionSampleApi,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: samplesApiQueryKey(["getSamples", { inspectionId }]),
    queryFn: () =>
      sampleApi.getSamples(
        inspectionId,
        //getHeadersForOfflineCaching(inspectionId),
      ),
    select: (response) => response.samples ?? [],
  });
}
