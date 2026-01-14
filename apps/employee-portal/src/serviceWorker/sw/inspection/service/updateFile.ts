/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCLAudioMetaData,
  ApiCLImageMetaData,
  ApiChecklist,
  ApiGetChecklistsResponseFromJSON,
  ApiGetChecklistsResponseToJSON,
  ApiUpdateChecklistElementsInner,
} from "@eshg/inspection-api";

import { X_ESHG_INSPECTION_ID, uuidV4Re } from "@/serviceWorker/common/common";
import {
  getApiCacheEntries,
  getFromApiCache,
  writeFileToApiCache,
  writeToApiCache,
} from "@/serviceWorker/sw/cache";
import { getApiInspectionChecklistPath } from "@/serviceWorker/sw/inspection/service/updateChecklist";
import { advanceToExecutingPhase } from "@/serviceWorker/sw/inspection/service/updateInspection";
import { replaceRecursive } from "@/serviceWorker/sw/replaceRecursive";

const API_INSPECTION_CHECKLISTS_PATH_PATTERN = new RegExp(
  `^/api/inspection/checklists/${uuidV4Re}$`,
  "i",
);

function getApiInspectionChecklistFilePath(fileId: string) {
  return `/api/inspection/checklists/file/${fileId}`;
}

export async function addFile(
  inspectionId: string,
  checklistId: string,
  checklistUpdate: ApiUpdateChecklistElementsInner,
  fileId: string,
  file: File,
): Promise<ApiChecklist> {
  const getRequestPath = getApiInspectionChecklistPath(inspectionId);
  const response = await getFromApiCache(getRequestPath);
  const checklistsResponse = ApiGetChecklistsResponseFromJSON(
    await response.json(),
  );
  const { checklists } = checklistsResponse;

  const index = checklists.findIndex(
    (checklist) => checklist.id === checklistId,
  );
  if (index < 0) {
    throw new Error(
      `Checklist ${checklistId} not found in inspection ${inspectionId} cache entry`,
    );
  }

  const updatedChecklist = updateChecklist(
    checklists,
    index,
    checklistUpdate,
    fileId,
    file,
  );

  await advanceToExecutingPhase(inspectionId);

  await writeToApiCache(
    getRequestPath,
    new Response(
      JSON.stringify(ApiGetChecklistsResponseToJSON(checklistsResponse)),
      response,
    ),
  );

  await writeFileToApiCache(
    new Request(self.origin + getApiInspectionChecklistFilePath(fileId), {
      headers: { [X_ESHG_INSPECTION_ID]: inspectionId },
    }),
    file,
  );

  return updatedChecklist;
}

function updateChecklist(
  checklists: ApiChecklist[],
  index: number,
  checklistUpdate: ApiUpdateChecklistElementsInner,
  fileId: string,
  file: File,
): ApiChecklist {
  const type = checklistUpdate.type;
  if (type === "IMAGE") {
    const imageMetaData: ApiCLImageMetaData[] = [
      {
        imageID: fileId,
        fileName: file.name,
        fileSize: file.size,
        fileDate: new Date(),
      },
    ];
    const updatedChecklist = replaceRecursive(checklists[index]!, {
      ...checklistUpdate,
      imageMetaData,
    });
    checklists.splice(index, 1, updatedChecklist);
    return updatedChecklist;
  } else if (type === "AUDIO") {
    const audioMetaData: ApiCLAudioMetaData[] = [
      {
        audioID: fileId,
        fileName: file.name,
        fileSize: file.size,
        fileDate: new Date(),
      },
    ];
    const updatedChecklist = replaceRecursive(checklists[index]!, {
      ...checklistUpdate,
      audioMetaData,
    });
    checklists.splice(index, 1, updatedChecklist);
    return updatedChecklist;
  } else {
    throw new Error(`unexpected type: ${type}`);
  }
}

// getChecklistsResponse in return value must be member of getChecklistsResponses
export async function deleteFile(fileId: string): Promise<void> {
  const checklists = await getApiCacheEntries(
    API_INSPECTION_CHECKLISTS_PATH_PATTERN,
  );

  const checklistsByPayload = await Promise.all(
    checklists.map(async ({ request, response }) => ({
      getChecklistsResponse: ApiGetChecklistsResponseFromJSON(
        await response.json(),
      ),
      request,
      response,
    })),
  );

  for (const {
    getChecklistsResponse,
    request,
    response,
  } of checklistsByPayload) {
    const found = getChecklistsResponse.checklists.some((checklist) =>
      checklist.sections.some((section) =>
        section.elements.some((element) => {
          if (element.type === "IMAGE") {
            const index = element.imageMetaData.findIndex(
              (imageMetaData) => imageMetaData.imageID === fileId,
            );
            if (index < 0) return 0;
            return element.imageMetaData.splice(index, 1).length;
          } else if (element.type === "AUDIO") {
            const index = element.audioMetaData.findIndex(
              (audioMetadata) => audioMetadata.audioID === fileId,
            );
            if (index < 0) return 0;
            return element.audioMetaData.splice(index, 1).length;
          }
        }),
      ),
    );
    if (!found) continue;

    await writeToApiCache(
      request,
      new Response(
        JSON.stringify(ApiGetChecklistsResponseToJSON(getChecklistsResponse)),
        response,
      ),
    );

    return;
  }
  throw new Error(`File ${fileId} not found in cache`);
}
