/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StaticImageData } from "next/image";

import { ApiBusinessModule, ApiProcedureType } from "@eshg/base-api";

import inspectionProcedureDefinitionDiagram from "@/lib/businessModules/inspection/shared/procedureDefinition.svg";
import measlesProtectionProcedureDefinitionDiagram from "@/lib/businessModules/measlesProtection/shared/procedureDefinition.svg";
import medicalRegistryProcedureDefinitionDiagram from "@/lib/businessModules/medicalRegistry/shared/procedureDefinition.svg";
import officialMedicalServiceProcedureDefinitionDiagram from "@/lib/businessModules/officialMedicalService/shared/procedureDefinition.svg";
import schoolEntryProcedureDefinitionDiagram from "@/lib/businessModules/schoolEntry/shared/procedureDefinition.svg";
import travelMedicineProcedureDefinitionDiagram from "@/lib/businessModules/travelMedicine/shared/procedureDefinition.svg";

export function resolveProcedureDefinitionDiagram(
  businessModule: ApiBusinessModule,
  _procedureType: ApiProcedureType,
): StaticImageData | undefined {
  switch (businessModule) {
    case "SCHOOL_ENTRY":
      return schoolEntryProcedureDefinitionDiagram;
    case "INSPECTION":
      return inspectionProcedureDefinitionDiagram;
    case "TRAVEL_MEDICINE":
      return travelMedicineProcedureDefinitionDiagram;
    case "MEASLES_PROTECTION":
      return measlesProtectionProcedureDefinitionDiagram;
    case "MEDICAL_REGISTRY":
      return medicalRegistryProcedureDefinitionDiagram;
    case "OFFICIAL_MEDICAL_SERVICE":
      return officialMedicalServiceProcedureDefinitionDiagram;
    case "STI_PROTECTION":
    case "MEDS_ABROAD":
    case "DENTAL":
      return undefined;
  }
}
