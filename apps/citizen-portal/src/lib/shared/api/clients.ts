/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Configuration,
  PublicConfigApi,
  PublicDepartmentApi,
  PublicStreetApi,
} from "@eshg/base-api";
import { ApiConfiguration } from "@eshg/lib-portal";
import {
  ApiBusinessModule,
  Configuration as BusinessModuleConfiguration,
  ConfigurationParameters,
  GdprValidationTaskApi,
} from "@eshg/lib-procedures-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

export const BUSINESS_MODULE_URLS = {
  [ApiBusinessModule.SchoolEntry]: "PUBLIC_SCHOOL_ENTRY_BACKEND_URL",
  [ApiBusinessModule.Inspection]: "PUBLIC_INSPECTION_BACKEND_URL",
  [ApiBusinessModule.MeaslesProtection]:
    "PUBLIC_MEASLES_PROTECTION_BACKEND_URL",
  [ApiBusinessModule.TravelMedicine]: "PUBLIC_TRAVEL_MEDICINE_BACKEND_URL",
  [ApiBusinessModule.StiProtection]: "PUBLIC_STI_PROTECTION_BACKEND_URL",
  [ApiBusinessModule.MedicalRegistry]: "PUBLIC_MEDICAL_REGISTRY_BACKEND_URL",
  [ApiBusinessModule.Dental]: "PUBLIC_DENTAL_BACKEND_URL",
  [ApiBusinessModule.OfficialMedicalService]:
    "PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL",
  [ApiBusinessModule.MedsAbroad]: "PUBLIC_MEDS_ABROAD_BACKEND_URL",
} as const satisfies Record<ApiBusinessModule, keyof ApiConfiguration>;

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
    "PUBLIC_BASE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function usePublicDepartmentApi() {
  const configuration = useConfiguration();
  return new PublicDepartmentApi(configuration);
}

export function usePublicConfigApi() {
  const configuration = useConfiguration();
  return new PublicConfigApi(configuration);
}

export function usePublicStreetApi() {
  const configuration = useConfiguration();
  return new PublicStreetApi(configuration);
}

type ConfigurationConstructor<TConfiguration> = new (
  params: ConfigurationParameters,
) => TConfiguration;

function useConfigurationByBusinessModule<TConfiguration>(
  businessModule: ApiBusinessModule,
  Configuration: ConfigurationConstructor<TConfiguration>,
): TConfiguration {
  const configurationParameters = useCitizenPortalApiConfiguration(
    BUSINESS_MODULE_URLS[businessModule as keyof typeof BUSINESS_MODULE_URLS],
  );
  return new Configuration(configurationParameters);
}

export function useGdprValidationTaskApi(businessModule: ApiBusinessModule) {
  const configuration = useConfigurationByBusinessModule(
    businessModule,
    BusinessModuleConfiguration,
  );
  return new GdprValidationTaskApi(configuration);
}
