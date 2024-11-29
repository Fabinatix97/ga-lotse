/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiBusinessModule,
  Configuration,
  GdprValidationTaskApi,
} from "@eshg/employee-portal-api/businessProcedures";
import {
  ApiConfiguration,
  useApiConfiguration,
} from "@eshg/lib-portal/api/ApiProvider";

const businessModuleBackendUrls = {
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
} as const satisfies Record<ApiBusinessModule, keyof ApiConfiguration>;

export function useConfigurationByBusinessModule(
  businessModule: ApiBusinessModule,
) {
  const configurationParameters = useApiConfiguration(
    businessModuleBackendUrls[businessModule],
  );

  return new Configuration(configurationParameters);
}

export function useGdprValidationTaskApi(businessModule: ApiBusinessModule) {
  const configuration = useConfigurationByBusinessModule(businessModule);
  return new GdprValidationTaskApi(configuration);
}
