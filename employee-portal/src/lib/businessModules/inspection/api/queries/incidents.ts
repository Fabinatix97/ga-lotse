/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InspectionIncidentApi } from "@eshg/employee-portal-api/inspection";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useIncidentApi } from "@/lib/businessModules/inspection/api/clients";
import { incidentsApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { useGetHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/useGetHeadersForOfflineCaching";

export function useGetIncidents(inspectionId: string) {
  const incidentApi = useIncidentApi();
  const getPreCacheForOfflineModeHeaders = useGetHeadersForOfflineCaching();
  return useSuspenseQuery(
    getIncidentsQuery(
      incidentApi,
      getPreCacheForOfflineModeHeaders,
      inspectionId,
    ),
  );
}

export function getIncidentsQuery(
  incidentApi: InspectionIncidentApi,
  getPreCacheForOfflineModeHeaders: (inspectionId?: string) => RequestInit,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: incidentsApiQueryKey(["getIncidents", { inspectionId }]),
    queryFn: () =>
      incidentApi.getIncidents(
        inspectionId,
        getPreCacheForOfflineModeHeaders(inspectionId),
      ),
    select: (response) => response.incidents ?? [],
  });
}
