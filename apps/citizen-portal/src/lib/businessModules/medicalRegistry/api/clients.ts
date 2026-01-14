/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  MedicalRegistryApi,
  MedicalRegistryPublicCitizenApi,
} from "@eshg/medical-registry-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
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
