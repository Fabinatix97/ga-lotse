/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { baseConfigRouterEndpoints } from "@/lib/baseModule/shared/configuratorConfig";
import { inspectionConfigRouterEndpoints } from "@/lib/businessModules/inspection/shared/configuratorConfig";
import { measlesProtectionConfigRouterEndpoints } from "@/lib/businessModules/measlesProtection/shared/configuratorConfig";
import { medicalRegistryConfigRouterEndpoints } from "@/lib/businessModules/medicalRegistry/shared/configuratorConfig";
import { omsConfigRouterEndpoints } from "@/lib/businessModules/officialMedicalService/shared/configuratorConfig";
import { esuConfigRouterEndpoints } from "@/lib/businessModules/schoolEntry/shared/configuratorConfig";
import { stiConfigRouterEndpoints } from "@/lib/businessModules/stiProtection/shared/configuratorConfig";
import { travelMedicineConfigRouterEndpoints } from "@/lib/businessModules/travelMedicine/shared/configuratorConfig";
import { prostituteProtectionConfigRouterEndpoints } from "@/lib/configurator/shared/prostituteProtectionConfigRouterEndpoints";
import { opendataConfigRouterEndpoints } from "@/lib/opendata/configuratorConfig";

import { medsAbroadConfigRouterEndpoints } from "./medsAbroadConfigRouterEndpoints";
import { ConfiguratorEndpointName, ConfiguratorModuleName } from "./types";

export function getEndpointNamesByModule(
  module: ConfiguratorModuleName,
): ConfiguratorEndpointName[] {
  switch (module) {
    case "BASE":
      return baseConfigRouterEndpoints;
    case "MEASLES_PROTECTION":
      return measlesProtectionConfigRouterEndpoints;
    case "MEDICAL_REGISTRY":
      return medicalRegistryConfigRouterEndpoints;
    case "OFFICIAL_MEDICAL_SERVICE":
      return omsConfigRouterEndpoints;
    case "OPEN_DATA":
      return opendataConfigRouterEndpoints;
    case "SCHOOL_ENTRY":
      return esuConfigRouterEndpoints;
    case "STI_PROTECTION":
    case "SEX_WORK":
      return stiConfigRouterEndpoints;
    case "TRAVEL_MEDICINE":
      return travelMedicineConfigRouterEndpoints;
    case "MEDS_ABROAD":
      return medsAbroadConfigRouterEndpoints;
    case "INSPECTION":
      return inspectionConfigRouterEndpoints;
    case "PROSTITUTE_PROTECTION":
      return prostituteProtectionConfigRouterEndpoints;
  }
}

export function isEndpointSupportedByModule(
  module: ConfiguratorModuleName,
  endpointName: ConfiguratorEndpointName,
): boolean {
  return getEndpointNamesByModule(module).includes(endpointName);
}
