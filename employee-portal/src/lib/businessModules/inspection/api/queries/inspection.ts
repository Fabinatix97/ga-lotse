/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InspectionApi } from "@eshg/employee-portal-api/inspection";
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { inspectionApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";

export function inspectionGettersQueryKey(inspectionId: string) {
  return inspectionApiQueryKey(["inspectionGetters", { inspectionId }]);
}

export function getInspectionQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getInspection",
  ]);
}

export function getAvailableCLDVsQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getAvailableCLDVs",
  ]);
}

export function getAvailablePLDRsQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getAvailablePLDRs",
  ]);
}

export function getFacilityDuplicatesQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getFacilityDuplicates",
  ]);
}

export function getInspectionDuplicatesQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "getInspectionDuplicates",
  ]);
}

export function postInspectionViewedQueryKey(inspectionId: string) {
  return inspectionApiQueryKey([
    inspectionGettersQueryKey(inspectionId),
    "postInspectionViewed",
  ]);
}

export function useGetInspection(procedureId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery(getInspectionQuery(inspectionApi, procedureId));
}

export function getInspectionQuery(
  inspectionApi: InspectionApi,
  procedureId: string,
) {
  return queryOptions({
    queryKey: getInspectionQueryKey(procedureId),
    queryFn: () =>
      inspectionApi.getInspection(
        procedureId,
        getHeadersForOfflineCaching(procedureId),
      ),
  });
}

export function useGetAvailableCLDVs(inspectionId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery(getAvailableCLDVsQuery(inspectionApi, inspectionId));
}

export function getAvailableCLDVsQuery(
  inspectionApi: InspectionApi,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: getAvailableCLDVsQueryKey(inspectionId),
    queryFn: () =>
      inspectionApi.getAvailableCLDs(
        inspectionId,
        getHeadersForOfflineCaching(inspectionId),
      ),
  });
}

export function useGetAvailablePLDRs(inspectionId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery({
    queryKey: getAvailablePLDRsQueryKey(inspectionId),
    queryFn: () =>
      inspectionApi.getAvailablePLDs(
        inspectionId,
        getHeadersForOfflineCaching(inspectionId),
      ),
  });
}

export function useGetFacilityDuplicates(procedureId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery({
    queryKey: getFacilityDuplicatesQueryKey(procedureId),
    queryFn: () => inspectionApi.getFacilityDuplicates(procedureId),
  });
}

export function useGetInspectionDuplicates(procedureId: string) {
  const inspectionApi = useInspectionApi();
  return useSuspenseQuery({
    queryKey: getInspectionDuplicatesQueryKey(procedureId),
    queryFn: () => inspectionApi.getInspectionDuplicates(procedureId),
  });
}

export function useInspectionViewed(inspectionId: string) {
  const queryClient = useQueryClient();
  const inspectionApi = useInspectionApi();

  useEffect(() => {
    void queryClient.fetchQuery({
      queryKey: postInspectionViewedQueryKey(inspectionId),
      queryFn: () => inspectionApi.inspectionViewed(inspectionId),
    });
  }, [queryClient, inspectionApi, inspectionId]);
}
