/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  Configuration,
  OpenDataApi,
  OpenDataFeatureTogglesApi,
} from "@eshg/opendata-api";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_OPENDATA_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useOpenDataApi() {
  return new OpenDataApi(useConfiguration());
}

export function useOpenDataFeatureToggleApi() {
  return new OpenDataFeatureTogglesApi(useConfiguration());
}
