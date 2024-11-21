/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiBusinessModule,
  ApiProcedureType,
} from "@eshg/employee-portal-api/base";
import { StaticImageData } from "next/image";

import inspectionProcedureDefinitionDiagram from "@/lib/businessModules/inspection/shared/procedureDefinition.svg";
import measlesProtectionProcedureDefinitionDiagram from "@/lib/businessModules/measlesProtection/shared/procedureDefinition.svg";
import medicalRegistryProcedureDefinitionDiagram from "@/lib/businessModules/medicalRegistry/shared/procedureDefinition.svg";
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
  }
}
