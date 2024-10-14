/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBusinessModule,
  ApiProcedureStatus,
} from "@eshg/employee-portal-api/base";

import { routes as inspectionRoutes } from "@/lib/businessModules/inspection/shared/routes";
import { routes as measlesProtectionRoutes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { routes as medicalRegistryRoutes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { routes as schoolEntryRoutes } from "@/lib/businessModules/schoolEntry/shared/routes";
import { routes as stiProtectionRoutes } from "@/lib/businessModules/stiProtection/shared/routes";
import { routes as travelMedicineRoutes } from "@/lib/businessModules/travelMedicine/shared/routes";

export function resolveProcedureDetailsRoute({
  businessModule,
  procedureId,
  status,
}: {
  businessModule: ApiBusinessModule;
  procedureId: string;
  status?: ApiProcedureStatus;
}) {
  switch (businessModule) {
    case "SCHOOL_ENTRY":
      return schoolEntryRoutes.procedures.byId(procedureId).details;
    case "INSPECTION":
      return inspectionRoutes.procedures.details(procedureId);
    case "TRAVEL_MEDICINE":
      return travelMedicineRoutes.procedures.baseData(procedureId);
    case "MEASLES_PROTECTION":
      if (status === ApiProcedureStatus.Draft) {
        return measlesProtectionRoutes.procedures.draft(procedureId);
      }
      return measlesProtectionRoutes.procedures.details(procedureId).index;
    case "STI_PROTECTION":
      return stiProtectionRoutes.procedures.byId(procedureId).index;
    case "MEDICAL_REGISTRY":
      return medicalRegistryRoutes.procedures.byId(procedureId).index;
  }
}

export function resolveProcedureProgressEntriesRoute(
  businessModule: ApiBusinessModule,
  procedureId: string,
) {
  switch (businessModule) {
    case "SCHOOL_ENTRY":
      return schoolEntryRoutes.procedures.byId(procedureId).progressEntries
        .index;
    case "INSPECTION":
      return inspectionRoutes.procedures.progressEntries(procedureId).index;
    case "TRAVEL_MEDICINE":
      return travelMedicineRoutes.procedures.progressEntries(procedureId).index;
    case "MEASLES_PROTECTION":
      return measlesProtectionRoutes.procedures.details(procedureId)
        .progressEntries.index;
    case "STI_PROTECTION":
      return stiProtectionRoutes.procedures.byId(procedureId).index;
    case "MEDICAL_REGISTRY":
      return medicalRegistryRoutes.procedures.byId(procedureId).index;
  }
}

export function resolveTeamviewRoute(businessModule: ApiBusinessModule) {
  if (businessModule === "INSPECTION") {
    return inspectionRoutes.teamview.index;
  } else {
    throw new Error(
      `Teamview not implemented for business module ${businessModule}`,
    );
  }
}
