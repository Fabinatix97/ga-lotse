/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspPendingFacility,
  ApiInspection,
} from "@eshg/employee-portal-api/inspection";

import { getInspection } from "@/serviceWorker/sw/inspection/service/updateInspection";

export async function getFacilities(
  inspectionIds: string[],
): Promise<ApiInspPendingFacility[]> {
  return Promise.all(
    inspectionIds.map(async (inspectionId) => {
      const { inspectionResponse } = await getInspection(inspectionId);
      return getInspectionPendingFacilityFromInspection(inspectionResponse);
    }),
  );
}

function getInspectionPendingFacilityFromInspection(
  inspection: ApiInspection,
): ApiInspPendingFacility {
  return {
    centralFileStateId: inspection.facility.baseFacility.id,
    city: inspection.facility.baseFacility.contactAddress!.city,
    id: inspection.facility.id,
    inspection: {
      id: inspection.externalId,
      phase: inspection.phase,
      status: inspection.status,
      type: inspection.type,
      numberOfIncidents: inspection.incidents?.length ?? 0,
      possibleInspectionDuplicate: false,
    },
    kind:
      roundToDate(inspection.plannedAppointment!.start.getDate()) >
      roundToDate(Date.now())
        ? "PENDING"
        : "OVERDUE",
    name: inspection.facility.baseFacility.name,
    objecttype: inspection.facility?.objectType,
    plannedFrom: inspection.plannedAppointment!.start,
    postalCode: inspection.facility.baseFacility.contactAddress!.postalCode,
    street:
      inspection.facility.baseFacility.contactAddress!.type === "PostboxAddress"
        ? "Postfach"
        : inspection.facility.baseFacility.contactAddress!.street,
    possibleFacilityDuplicate: false,
  };
}

function roundToDate(dateTime: number): number {
  return (dateTime / (24 * 60 * 60 * 1000)) | 0;
}
