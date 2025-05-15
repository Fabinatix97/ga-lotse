/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule, ApiProcedureStatus } from "@eshg/base-api";
import { routes as dentalRoutes } from "@eshg/dental";

import { routes as inspectionRoutes } from "@/lib/businessModules/inspection/shared/routes";
import { routes as measlesProtectionRoutes } from "@/lib/businessModules/measlesProtection/shared/routes";
import { routes as medicalRegistryRoutes } from "@/lib/businessModules/medicalRegistry/shared/routes";
import { routes as officialMedicalServiceRoutes } from "@/lib/businessModules/officialMedicalService/shared/routes";
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
}): string {
  switch (businessModule) {
    case "SCHOOL_ENTRY":
      return schoolEntryRoutes.procedures.byId(procedureId).details;
    case "INSPECTION":
      return inspectionRoutes.procedures.details(procedureId);
    case "TRAVEL_MEDICINE":
      return travelMedicineRoutes.procedures.baseData(procedureId);
    case "MEASLES_PROTECTION":
      if (status === ApiProcedureStatus.Draft) {
        return measlesProtectionRoutes.procedures.draft(procedureId).index;
      }
      return measlesProtectionRoutes.procedures.details(procedureId).index;
    case "STI_PROTECTION":
      return stiProtectionRoutes.procedures.byId(procedureId).details;
    case "MEDICAL_REGISTRY":
      return medicalRegistryRoutes.procedures.byId(procedureId).index;
    case "DENTAL":
      return dentalRoutes.children.byId(procedureId).details;
    case "OFFICIAL_MEDICAL_SERVICE":
      return officialMedicalServiceRoutes.procedures.byId(procedureId).details;
    case "MEDS_ABROAD":
      return "";
  }
}

export function resolveProcedureProgressEntriesRoute(
  businessModule: ApiBusinessModule,
  procedureId: string,
): string {
  switch (businessModule) {
    case "SCHOOL_ENTRY":
      return schoolEntryRoutes.procedures.byId(procedureId).progressEntries;
    case "INSPECTION":
      return inspectionRoutes.procedures.progressEntries(procedureId);
    case "TRAVEL_MEDICINE":
      return travelMedicineRoutes.procedures.progressEntries(procedureId);
    case "MEASLES_PROTECTION":
      return measlesProtectionRoutes.procedures.details(procedureId)
        .progressEntries;
    case "STI_PROTECTION":
      return stiProtectionRoutes.procedures.byId(procedureId).details;
    case "MEDICAL_REGISTRY":
      return medicalRegistryRoutes.procedures.byId(procedureId).index;
    case "DENTAL":
      return dentalRoutes.children.byId(procedureId).progressEntries;
    case "OFFICIAL_MEDICAL_SERVICE":
      return officialMedicalServiceRoutes.procedures.byId(procedureId)
        .progressEntries;
    case "MEDS_ABROAD":
      return "";
  }
}
