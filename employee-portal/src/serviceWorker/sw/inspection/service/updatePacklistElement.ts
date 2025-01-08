/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetPacklistsResponseFromJSON,
  ApiGetPacklistsResponseToJSON,
  ApiPacklist,
  ApiUpdatePacklistElementRequest,
} from "@eshg/employee-portal-api/inspection";

import { getFromApiCache, writeToApiCache } from "@/serviceWorker/sw/cache";

export function getApiInspectionPacklistPath(inspectionId: string) {
  return `/api/inspection/packlists/${inspectionId}`;
}

export async function updatePacklistElement(
  updatePacklistElementRequest: ApiUpdatePacklistElementRequest,
  packlistId: string,
  packlistElementId: string,
  inspectionId: string,
): Promise<ApiPacklist> {
  const getRequestPath = getApiInspectionPacklistPath(inspectionId);
  const response = await getFromApiCache(getRequestPath);
  const packlistsResponse = ApiGetPacklistsResponseFromJSON(
    await response.json(),
  );

  const packlistIndex = packlistsResponse.packlists.findIndex(
    (packlist) => packlist.id === packlistId,
  );
  const packlist = packlistsResponse.packlists[packlistIndex];
  if (!packlist) {
    throw new Error(
      `Packlist ${packlistId} not found in inspection ${inspectionId} cache entry`,
    );
  }
  const elementIndex = packlist.elements.findIndex(
    (element) => element.id === packlistElementId,
  );

  const packlistElement = packlist.elements[elementIndex];
  if (!packlistElement) {
    throw new Error(
      `Packlist element ${packlistElementId} of packlist ${packlistId} not found in inspection ${inspectionId} cache entry`,
    );
  }

  packlistElement.isChecked = updatePacklistElementRequest.checked;

  await writeToApiCache(
    getRequestPath,
    new Response(
      JSON.stringify(ApiGetPacklistsResponseToJSON(packlistsResponse)),
      response,
    ),
  );

  return packlist;
}
