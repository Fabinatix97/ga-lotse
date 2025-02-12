/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiUpdateChecklistRequestFromJSON,
  ApiUpdateChecklistResponseToJSON,
} from "@eshg/inspection-api";

import { API_INSPECTION_CHECKLISTS_CHECKLIST_PATH_PATTERN } from "@/serviceWorker/sw/config";
import { updateChecklist } from "@/serviceWorker/sw/inspection/service/updateChecklist";
import {
  UpdateCacheCallbackParam,
  UpdateCacheCallbackReturnValue,
} from "@/serviceWorker/sw/requestHandlers";
import { requireNonNullish } from "@/serviceWorker/sw/util";

export async function updateChecklistCache({
  requestPath,
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const pathMatch =
    API_INSPECTION_CHECKLISTS_CHECKLIST_PATH_PATTERN.exec(requestPath)?.groups;
  const inspectionId = requireNonNullish(pathMatch?.inspectionId);
  const checklistId = requireNonNullish(pathMatch?.checklistId);
  const updateChecklistRequest = ApiUpdateChecklistRequestFromJSON(
    JSON.parse(await request.clone().text()),
  );

  const checklist = await updateChecklist(
    updateChecklistRequest,
    checklistId,
    inspectionId,
  );

  const updatedResponseBody = JSON.stringify(
    ApiUpdateChecklistResponseToJSON({ checklist }),
  );
  return { responseBody: updatedResponseBody, request };
}
