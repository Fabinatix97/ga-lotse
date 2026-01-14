/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CitizenAuthApi,
  CitizenPublicApi,
  Configuration,
} from "@eshg/official-medical-service-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
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
