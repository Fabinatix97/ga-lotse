/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import {
  InspectionSampleApi,
  InspectionSampleTemplateApi,
} from "@eshg/inspection-api";

import {
  useSampleApi,
  useSampleTemplateApi,
} from "@/lib/businessModules/inspection/api/clients";
import {
  sampleTemplateApiQueryKey,
  samplesApiQueryKey,
} from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";

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

export function useGetSampleTemplates() {
  const sampleTemplateApi = useSampleTemplateApi();
  return useSuspenseQuery(getSampleTemplatesQuery(sampleTemplateApi));
}

export function getSampleTemplatesQuery(
  sampleTemplateApi: InspectionSampleTemplateApi,
) {
  return queryOptions({
    queryKey: sampleTemplateApiQueryKey(["getInspectionSampleTemplates"]),
    queryFn: () => sampleTemplateApi.getInspectionSampleTemplates(),
    select: (response) => response.templates ?? [],
  });
}
