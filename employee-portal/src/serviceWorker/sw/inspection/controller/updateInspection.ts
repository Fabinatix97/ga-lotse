/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspectionToJSON,
  ApiUpdateInspectionRequestFromJSON,
} from "@eshg/inspection-api";

import { uuidV4Re } from "@/serviceWorker/common/common";
import { getFromApiCache, writeToApiCache } from "@/serviceWorker/sw/cache";
import { getInspection } from "@/serviceWorker/sw/inspection/service/updateInspection";
import {
  UpdateCacheCallbackParam,
  UpdateCacheCallbackReturnValue,
} from "@/serviceWorker/sw/requestHandlers";
import { requireNonNullish } from "@/serviceWorker/sw/util";

export const API_INSPECTION_INSPECTIONS_INSPECTION = new RegExp(
  `^/api/inspection/inspections/(?<inspectionId>${uuidV4Re})$`,
  "i",
);

export function getApiInspectionPath(inspectionId: string) {
  return `/api/inspection/inspections/${inspectionId}`;
}

export async function updateInspectionInCache({
  requestPath,
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const pathMatch =
    API_INSPECTION_INSPECTIONS_INSPECTION.exec(requestPath)?.groups;
  const inspectionId = requireNonNullish(pathMatch?.inspectionId);
  const updateInspectionRequest = ApiUpdateInspectionRequestFromJSON(
    JSON.parse(await request.clone().text()),
  );

  const inspectionResponse = await getInspection(inspectionId);
  const inspection = inspectionResponse.inspectionResponse;

  // For now, we only support writing notes and executedAppointment.
  if (updateInspectionRequest.notes != null) {
    inspection.notes = updateInspectionRequest.notes;
  }
  if (updateInspectionRequest.executedAppointment != null) {
    inspection.executedAppointment =
      updateInspectionRequest.executedAppointment;
  }

  const getRequestPath = getApiInspectionPath(inspectionId);
  const response = await getFromApiCache(getRequestPath);

  await writeToApiCache(
    getRequestPath,
    new Response(JSON.stringify(ApiInspectionToJSON(inspection)), response),
  );

  const responseBody = JSON.stringify(ApiInspectionToJSON(inspection));
  return { responseBody, request };
}
