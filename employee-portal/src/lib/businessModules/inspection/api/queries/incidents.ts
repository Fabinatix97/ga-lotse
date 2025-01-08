/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InspectionIncidentApi } from "@eshg/employee-portal-api/inspection";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useIncidentApi } from "@/lib/businessModules/inspection/api/clients";
import { incidentsApiQueryKey } from "@/lib/businessModules/inspection/api/queries/apiQueryKeys";
import { getHeadersForOfflineCaching } from "@/lib/businessModules/inspection/shared/offline/getHeadersForOfflineCaching";

export function useGetIncidents(inspectionId: string) {
  const incidentApi = useIncidentApi();
  return useSuspenseQuery(getIncidentsQuery(incidentApi, inspectionId));
}

export function getIncidentsQuery(
  incidentApi: InspectionIncidentApi,
  inspectionId: string,
) {
  return queryOptions({
    queryKey: incidentsApiQueryKey(["getIncidents", { inspectionId }]),
    queryFn: () =>
      incidentApi.getIncidents(
        inspectionId,
        getHeadersForOfflineCaching(inspectionId),
      ),
    select: (response) => response.incidents ?? [],
  });
}
