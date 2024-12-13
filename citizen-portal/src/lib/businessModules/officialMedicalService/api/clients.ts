/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CitizenPublicApi,
  Configuration,
} from "@eshg/citizen-portal-api/officialMedicalService";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_OFFICIAL_MEDICAL_SERVICE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useCitizenPublicApi() {
  return new CitizenPublicApi(useConfiguration());
}
