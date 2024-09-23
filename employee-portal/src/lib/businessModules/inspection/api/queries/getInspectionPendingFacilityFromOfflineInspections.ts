/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspPendingFacility } from "@eshg/employee-portal-api/inspection";

import { isGetInspectionPendingFacilityFromOfflineInspectionsResponse } from "@/serviceWorker/common/GetInspectionPendingFacilityFromOfflineInspections";

// this doesn't send a rest query but fetches the data from the service worker via message
export async function getInspectionPendingFacilityFromOfflineInspections(
  sendMessageToServiceWorker: (message: object) => Promise<unknown>,
  inspectionIds: string[],
): Promise<ApiInspPendingFacility[]> {
  const response: unknown = await sendMessageToServiceWorker({
    type: "getInspectionPendingFacilityFromOfflineInspections",
    inspectionIds,
  });
  if (!isGetInspectionPendingFacilityFromOfflineInspectionsResponse(response)) {
    throw new Error(
      "Unexpected return type for getInspectionPendingFacilityFromOfflineInspections",
    );
  }
  return response.facilities;
}
