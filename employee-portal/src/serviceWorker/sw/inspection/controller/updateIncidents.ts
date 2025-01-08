/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateInspectionIncidentRequestFromJSON,
  ApiGetInspectionIncidentsResponseFromJSON,
  ApiGetInspectionIncidentsResponseToJSON,
  ApiInspectionIncident,
  ApiInspectionIncidentToJSON,
  ApiUpdateInspectionIncidentRequestFromJSON,
} from "@eshg/employee-portal-api/inspection";

import { uuidV4Re } from "@/serviceWorker/common/common";
import { getFromApiCache, writeToApiCache } from "@/serviceWorker/sw/cache";
import {
  createIncident,
  deleteIncident,
  updateIncident,
} from "@/serviceWorker/sw/inspection/service/updateIncidents";
import { updateIncidents } from "@/serviceWorker/sw/inspection/service/updateInspection";
import {
  UpdateCacheCallbackParam,
  UpdateCacheCallbackReturnValue,
} from "@/serviceWorker/sw/requestHandlers";
import { requireNonNullish } from "@/serviceWorker/sw/util";

export const API_INSPECTION_INSPECTIONS_INCIDENTS = new RegExp(
  `^/api/inspection/inspections/(?<inspectionId>${uuidV4Re})/incidents$`,
  "i",
);

export const API_INSPECTION_INSPECTIONS_INCIDENT = new RegExp(
  `^/api/inspection/inspections/(?<inspectionId>${uuidV4Re})/incidents/(?<incidentId>${uuidV4Re})$`,
  "i",
);

export function getApiInspectionIncidentsPath(inspectionId: string) {
  return `/api/inspection/inspections/${inspectionId}/incidents`;
}

export async function addIncidentToCache({
  requestPath,
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const pathMatch =
    API_INSPECTION_INSPECTIONS_INCIDENTS.exec(requestPath)?.groups;
  const inspectionId = requireNonNullish(pathMatch?.inspectionId);
  const createIncidentRequest = ApiCreateInspectionIncidentRequestFromJSON(
    JSON.parse(await request.clone().text()),
  );

  const incidentId = createIncidentRequest.externalId;

  const incident: ApiInspectionIncident = {
    inspectionId,
    incidentId,
    title: createIncidentRequest.title,
    description: createIncidentRequest.description,
  };

  await createIncident(incident);

  const responseBody = JSON.stringify(ApiInspectionIncidentToJSON(incident));
  return { responseBody, request };
}

export async function updateIncidentInCache({
  requestPath,
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const pathMatch =
    API_INSPECTION_INSPECTIONS_INCIDENT.exec(requestPath)?.groups;
  const inspectionId = requireNonNullish(pathMatch?.inspectionId);
  const incidentId = requireNonNullish(pathMatch?.incidentId);
  const updateIncidentRequest = ApiUpdateInspectionIncidentRequestFromJSON(
    JSON.parse(await request.clone().text()),
  );

  const getRequestPath = getApiInspectionIncidentsPath(inspectionId);

  const response = await getFromApiCache(getRequestPath);
  const getIncidentsResponse = ApiGetInspectionIncidentsResponseFromJSON(
    await response.json(),
  );

  const incident = updateIncident(
    getIncidentsResponse.incidents,
    incidentId,
    inspectionId,
    updateIncidentRequest,
  );

  await writeToApiCache(
    getRequestPath,
    new Response(
      JSON.stringify(
        ApiGetInspectionIncidentsResponseToJSON(getIncidentsResponse),
      ),
      response,
    ),
  );

  await updateIncidents(inspectionId, getIncidentsResponse.incidents!);

  const updatedResponseBody = JSON.stringify(
    ApiInspectionIncidentToJSON(incident),
  );
  return { responseBody: updatedResponseBody, request };
}

export async function deleteIncidentFromCache({
  requestPath,
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const pathMatch =
    API_INSPECTION_INSPECTIONS_INCIDENT.exec(requestPath)?.groups;
  const inspectionId = requireNonNullish(pathMatch?.inspectionId);
  const incidentId = requireNonNullish(pathMatch?.incidentId);

  if (!(await deleteIncident(inspectionId, incidentId))) {
    throw new Error(
      `Inspection ${inspectionId} incident ${incidentId} not found in cache`,
    );
  }

  return {
    responseBody: null,
    request,
  };
}
