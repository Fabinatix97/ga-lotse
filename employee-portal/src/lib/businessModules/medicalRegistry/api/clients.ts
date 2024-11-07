/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  MedicalRegistryApi,
} from "@eshg/employee-portal-api/medicalRegistry";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_MEDICAL_REGISTRY_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useMedicalRegistryApi() {
  const config = useConfiguration();
  return new MedicalRegistryApi(config);
}
