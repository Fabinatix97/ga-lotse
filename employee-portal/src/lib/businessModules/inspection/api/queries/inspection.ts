/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InspectionApi } from "@eshg/employee-portal-api/inspection";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useInspectionApi } from "@/lib/businessModules/inspection/api/clients";
import { inspectionApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { useGetHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/useGetHeadersForOfflineCaching";

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

export function useGetInspection(procedureId: string) {
  const inspectionApi = useInspectionApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery(
    getInspectionQuery(
      inspectionApi,
      getPreCacheForOfflineModeHeaders,
      procedureId,
    ),
  );
}

export function getInspectionQuery(
  inspectionApi: InspectionApi,
  getPreCacheForOfflineModeHeaders: (inspectionId?: string) => RequestInit,
  procedureId: string,
) {
  return queryOptions({
    queryKey: getInspectionQueryKey(procedureId),
    queryFn: () =>
      inspectionApi.getInspection(
        procedureId,
        getPreCacheForOfflineModeHeaders(procedureId),
      ),
  });
}

export function useGetAvailableCLDVs(inspectionId: string) {
  const inspectionApi = useInspectionApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery(
    getAvailableCLDVsQuery(
      inspectionApi,
      getPreCacheForOfflineModeHeaders,
      inspectionId,
    ),
  );
}

export function getAvailableCLDVsQuery(
  inspectionApi: InspectionApi,
  getPreCacheForOfflineModeHeaders: (inspectionId?: string) => RequestInit,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: getAvailableCLDVsQueryKey(inspectionId),
    queryFn: () =>
      inspectionApi.getAvailableCLDs(
        inspectionId,
        getPreCacheForOfflineModeHeaders(inspectionId),
      ),
  });
}

export function useGetAvailablePLDRs(inspectionId: string) {
  const inspectionApi = useInspectionApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery({
    queryKey: getAvailablePLDRsQueryKey(inspectionId),
    queryFn: () =>
      inspectionApi.getAvailablePLDs(
        inspectionId,
        getPreCacheForOfflineModeHeaders(inspectionId),
      ),
  });
}
