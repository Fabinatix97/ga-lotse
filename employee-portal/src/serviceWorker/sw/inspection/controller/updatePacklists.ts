/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiPacklistToJSON,
  ApiUpdatePacklistElementRequestFromJSON,
} from "@eshg/inspection-api";

import { API_INSPECTION_PACKLISTS_PACKLIST_PATH_PATTERN } from "@/serviceWorker/sw/config";
import { updatePacklistElement } from "@/serviceWorker/sw/inspection/service/updatePacklistElement";
import {
  UpdateCacheCallbackParam,
  UpdateCacheCallbackReturnValue,
} from "@/serviceWorker/sw/requestHandlers";
import { requireNonNullish } from "@/serviceWorker/sw/util";

export async function updatePacklistCache({
  requestPath,
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const pathMatch =
    API_INSPECTION_PACKLISTS_PACKLIST_PATH_PATTERN.exec(requestPath)?.groups;
  const inspectionId = requireNonNullish(pathMatch?.inspectionId);
  const packlistId = requireNonNullish(pathMatch?.packlistId);
  const packlistElementId = requireNonNullish(pathMatch?.packlistElementId);
  const updatePacklistElementRequest = ApiUpdatePacklistElementRequestFromJSON(
    JSON.parse(await request.clone().text()),
  );

  const packlist = await updatePacklistElement(
    updatePacklistElementRequest,
    packlistId,
    packlistElementId,
    inspectionId,
  );

  const updatedResponseBody = JSON.stringify(ApiPacklistToJSON(packlist));
  return { responseBody: updatedResponseBody, request };
}
