/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  Configuration,
  OpenDataFeatureTogglesApi,
  OpenDataPublicCitizenApi,
} from "@eshg/opendata-api";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_OPEN_DATA_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useOpenDataPublicCitizenApi() {
  return new OpenDataPublicCitizenApi(useConfiguration());
}

export function useOpenDataFeatureTogglesApi() {
  return new OpenDataFeatureTogglesApi(useConfiguration());
}
