/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspectionFromJSON,
  ApiInspectionIncident,
  ApiInspectionPhase,
  ApiInspectionToJSON,
} from "@eshg/employee-portal-api/inspection";

import { getFromApiCache, writeToApiCache } from "@/serviceWorker/sw/cache";
import { API_INSPECTION_INSPECTIONS_FINALIZE_PATH_PATTERN } from "@/serviceWorker/sw/config";
import {
  UpdateCacheCallbackParam,
  UpdateCacheCallbackReturnValue,
} from "@/serviceWorker/sw/requestHandlers";
import { getFormData, requireNonNullish } from "@/serviceWorker/sw/util";

export function getApiInspectionInspectionsPath(inspectionId: string) {
  return `/api/inspection/inspections/${inspectionId}`;
}

export async function updateIncidents(
  inspectionId: string,
  incidents: ApiInspectionIncident[],
) {
  const { getRequestPath, response, inspectionResponse } =
    await getInspection(inspectionId);

  inspectionResponse.incidents = incidents;
  await writeToApiCache(
    getRequestPath,
    new Response(
      JSON.stringify(ApiInspectionToJSON(inspectionResponse)),
      response,
    ),
  );
}

export async function advanceToExecutingPhase(inspectionId: string) {
  const { getRequestPath, response, inspectionResponse } =
    await getInspection(inspectionId);

  if (inspectionResponse.phase === ApiInspectionPhase.ReadyForExecution) {
    inspectionResponse.phase = ApiInspectionPhase.Executing;
    await writeToApiCache(
      getRequestPath,
      new Response(
        JSON.stringify(ApiInspectionToJSON(inspectionResponse)),
        response,
      ),
    );
  }
}

export async function finalizeInspection({
  requestPath,
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const inspectionId = requireNonNullish(
    API_INSPECTION_INSPECTIONS_FINALIZE_PATH_PATTERN.exec(requestPath)?.groups
      ?.inspectionId,
  );

  const formData = await getFormData(request);
  if (!("finalizeInspectionRequest" in formData)) {
    throw new Error(
      "No finalizeInspectionRequest in FinalizeInspectionRequest",
    );
  }

  const { getRequestPath, response, inspectionResponse } =
    await getInspection(inspectionId);

  inspectionResponse.phase = ApiInspectionPhase.Executed;

  const responseBody = JSON.stringify(ApiInspectionToJSON(inspectionResponse));
  await writeToApiCache(getRequestPath, new Response(responseBody, response));

  return { responseBody, request };
}

export async function getInspection(inspectionId: string) {
  const getRequestPath = getApiInspectionInspectionsPath(inspectionId);
  const response = await getFromApiCache(getRequestPath);
  const inspectionResponse = ApiInspectionFromJSON(await response.json()); // clone?
  return { getRequestPath, response, inspectionResponse };
}
