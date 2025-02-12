/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  Configuration,
  MedicalRegistryApi,
  MedicalRegistryFeatureTogglesPublicApi,
  MedicalRegistryPublicCitizenApi,
} from "@eshg/medical-registry-api";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_MEDICAL_REGISTRY_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useMedicalRegistryApi() {
  const configuration = useConfiguration();
  return new MedicalRegistryApi(configuration);
}

export function useMedicalRegistryPublicCitizenApi() {
  const configuration = useConfiguration();
  return new MedicalRegistryPublicCitizenApi(configuration);
}

export function useFeatureTogglesApi() {
  return new MedicalRegistryFeatureTogglesPublicApi(useConfiguration());
}
