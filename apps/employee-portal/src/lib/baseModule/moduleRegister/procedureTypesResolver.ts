/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unique } from "remeda";

import { ApiBusinessModule, ApiProcedureType } from "@eshg/base-api";

import { procedureTypes as inspectionProcedureTypes } from "@/lib/businessModules/inspection/shared/constants";
import { procedureTypes as measlesProtectionProcedureTypes } from "@/lib/businessModules/measlesProtection/shared/constants";
import { procedureTypes as schoolEntryProcedureTypes } from "@/lib/businessModules/schoolEntry/shared/constants";
import { procedureTypes as travelMedicineProcedureTypes } from "@/lib/businessModules/travelMedicine/shared/constants";

export function resolveProcedureTypes(
  businessModule: ApiBusinessModule,
): ApiProcedureType[] {
  switch (businessModule) {
    case "SCHOOL_ENTRY":
      return schoolEntryProcedureTypes;
    case "INSPECTION":
      return inspectionProcedureTypes;
    case "TRAVEL_MEDICINE":
      return travelMedicineProcedureTypes;
    case "MEASLES_PROTECTION":
      return measlesProtectionProcedureTypes;
    default:
      return [];
  }
}

export function getAllProcedureTypes() {
  let procedureTypes: ApiProcedureType[] = [];
  Object.values(ApiBusinessModule).forEach((module) => {
    procedureTypes = procedureTypes.concat(resolveProcedureTypes(module));
  });
  return unique(procedureTypes);
}
