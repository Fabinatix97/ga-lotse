/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiUpdateChecklistResponseToJSON,
  ApiUploadMediaFileRequest,
  ApiUploadMediaFileRequestFromJSON,
} from "@eshg/employee-portal-api/inspection";

import { API_INSPECTION_CHECKLISTS_FILE_PATH_PATTERN } from "@/serviceWorker/sw/config";
import {
  addFile,
  deleteFile,
} from "@/serviceWorker/sw/inspection/service/updateFile";
import {
  UpdateCacheCallbackParam,
  UpdateCacheCallbackReturnValue,
} from "@/serviceWorker/sw/requestHandlers";
import {
  getFormData,
  getFormDataValueAsString,
  requireNonNullish,
} from "@/serviceWorker/sw/util";

export async function addFileToCache({
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const { uploadMediaFileRequest, file } =
    await unpackUploadMediaFileRequest(request);

  const updatedChecklist = await addFile(
    uploadMediaFileRequest.inspectionExternalId,
    uploadMediaFileRequest.checklistId,
    uploadMediaFileRequest.updateElementDto,
    uploadMediaFileRequest.fileExternalId,
    file,
  );

  const updatedResponseBody = JSON.stringify(
    ApiUpdateChecklistResponseToJSON({ checklist: updatedChecklist }),
  );
  return { responseBody: updatedResponseBody, request };
}

async function unpackUploadMediaFileRequest(request: Request): Promise<{
  uploadMediaFileRequest: ApiUploadMediaFileRequest;
  file: File;
}> {
  const formData = await getFormData(request);
  if (!("uploadMediaFileRequest" in formData)) {
    throw new Error("No uploadMediaFileRequest in ChecklistUploadFileRequest");
  }
  if (!("file" in formData)) {
    throw new Error("No file in ChecklistUploadFileRequest");
  }
  const uploadMediaFileRequest = ApiUploadMediaFileRequestFromJSON(
    JSON.parse(await getFormDataValueAsString(formData.uploadMediaFileRequest)),
  );
  const file = formData.file;
  if (typeof file === "string") {
    throw new Error("Expected File");
  }
  return { uploadMediaFileRequest, file };
}

export async function deleteFileFromCache({
  requestPath,
  request,
}: UpdateCacheCallbackParam): UpdateCacheCallbackReturnValue {
  const fileId = requireNonNullish(
    API_INSPECTION_CHECKLISTS_FILE_PATH_PATTERN.exec(requestPath)?.groups
      ?.fileId,
  );

  await deleteFile(fileId);

  return {
    responseBody: null,
    request,
  };
}
