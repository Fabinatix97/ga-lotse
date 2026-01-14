/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import {
  ApiGetInspectionIncidentsResponseFromJSON,
  ApiGetInspectionIncidentsResponseToJSON,
  ApiInspectionIncident,
  ApiUpdateInspectionIncidentRequest,
} from "@eshg/inspection-api";

import { getFromApiCache, writeToApiCache } from "@/serviceWorker/sw/cache";
import { updateIncidents } from "@/serviceWorker/sw/inspection/service/updateInspection";

function getApiInspectionIncidentsPath(inspectionId: string) {
  return `/api/inspection/inspections/${inspectionId}/incidents`;
}

export function updateIncident(
  incidents: ApiInspectionIncident[] | undefined,
  incidentId: string,
  inspectionId: string,
  updateIncidentRequest: ApiUpdateInspectionIncidentRequest,
) {
  const incident = incidents?.find((i) => i.incidentId === incidentId);
  if (incident === undefined) {
    throw new Error(
      `Inspection ${inspectionId} incident ${incidentId} not found in cache`,
    );
  }

  if (isDefined(updateIncidentRequest.title)) {
    incident.title = updateIncidentRequest.title;
  }
  if (isDefined(updateIncidentRequest.description)) {
    incident.description = updateIncidentRequest.description;
  }

  return incident;
}

export async function createIncident(incident: ApiInspectionIncident) {
  const { inspectionId } = incident;

  const getRequestPath = getApiInspectionIncidentsPath(inspectionId);
  const response = await getFromApiCache(getRequestPath);

  const getIncidentsResponse = ApiGetInspectionIncidentsResponseFromJSON(
    await response.json(),
  );
  getIncidentsResponse.incidents ??= [];
  const index = getIncidentsResponse.incidents.findIndex((i) =>
    greaterThan(i, incident),
  );
  if (index < 0) {
    getIncidentsResponse.incidents.push(incident);
  } else {
    getIncidentsResponse.incidents.splice(index, 0, incident);
  }

  await writeToApiCache(
    getRequestPath,
    new Response(
      JSON.stringify(
        ApiGetInspectionIncidentsResponseToJSON(getIncidentsResponse),
      ),
      response,
    ),
  );

  await updateIncidents(inspectionId, getIncidentsResponse.incidents);
}

export async function deleteIncident(inspectionId: string, incidentId: string) {
  const getRequestPath = getApiInspectionIncidentsPath(inspectionId);
  const response = await getFromApiCache(getRequestPath);
  const getIncidentsResponse = ApiGetInspectionIncidentsResponseFromJSON(
    await response.json(),
  );

  const index = getIncidentsResponse.incidents?.findIndex(
    (i) => i.incidentId === incidentId,
  );
  if (index === undefined || index < 0) {
    return false;
  }
  getIncidentsResponse.incidents!.splice(index, 1);

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
  return true;
}

function greaterThan(
  a: ApiInspectionIncident,
  b: ApiInspectionIncident,
): boolean {
  if (a.checklistNumber === b.checklistNumber) {
    if (a.sectionNumber === b.sectionNumber) {
      if (a.elementNumber === b.elementNumber) return false;
      if (b.elementNumber === undefined) return false;
      if (a.elementNumber === undefined) return true;
      return a.elementNumber > b.elementNumber;
    }
    if (b.sectionNumber === undefined) return false;
    if (a.sectionNumber === undefined) return true;
    return a.sectionNumber > b.sectionNumber;
  }
  if (b.checklistNumber === undefined) return false;
  if (a.checklistNumber === undefined) return true;
  return a.checklistNumber > b.checklistNumber;
}
