/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspPendingFacilitiesOverviewResponse } from "@eshg/inspection-api";

import { precachedInspectionIds } from "@/serviceWorker/common/precachedInspectionIds";
import { getFacilities } from "@/serviceWorker/sw/inspection/service/getFacilities";

export async function getPendingFacilities() {
  const inspectionIds = await precachedInspectionIds.getSuccessful();
  const facilities = await getFacilities(inspectionIds);
  const response: ApiInspPendingFacilitiesOverviewResponse = {
    elements: facilities,
    numberOfPossibleDuplicates: 0,
    totalNumberOfElements: facilities.length,
    totalPages: 1,
  };
  return response;
}
