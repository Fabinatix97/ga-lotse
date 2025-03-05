/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  CitizenAuthApi,
  CitizenPublicApi,
  Configuration,
} from "@eshg/official-medical-service-api";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useCitizenPublicApi() {
  return new CitizenPublicApi(useConfiguration());
}

export function useCitizenAuthApi() {
  return new CitizenAuthApi(useConfiguration());
}
