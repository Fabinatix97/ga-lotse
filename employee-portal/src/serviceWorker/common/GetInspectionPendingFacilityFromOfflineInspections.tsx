/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspPendingFacility } from "@eshg/employee-portal-api/inspection";

export interface GetInspectionPendingFacilityFromOfflineInspectionsMessage {
  type: "getInspectionPendingFacilityFromOfflineInspections";
  inspectionIds: string[];
}

export function isGetInspectionPendingFacilityFromOfflineInspectionsMessage(
  obj: unknown,
): obj is GetInspectionPendingFacilityFromOfflineInspectionsMessage {
  if (!obj || typeof obj !== "object") return false;
  return (
    "type" in obj &&
    obj.type === "getInspectionPendingFacilityFromOfflineInspections" &&
    "inspectionIds" in obj
  );
}

export interface GetInspectionPendingFacilityFromOfflineInspectionsResponse {
  type: "getInspectionPendingFacilityFromOfflineInspections";
  facilities: ApiInspPendingFacility[];
}

export function isGetInspectionPendingFacilityFromOfflineInspectionsResponse(
  obj: unknown,
): obj is GetInspectionPendingFacilityFromOfflineInspectionsResponse {
  if (!obj || typeof obj !== "object") return false;
  return (
    "type" in obj &&
    obj.type === "getInspectionPendingFacilityFromOfflineInspections" &&
    "facilities" in obj
  );
}
