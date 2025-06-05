/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  OpenDataApi,
  OpenDataFeatureTogglesApi,
} from "@eshg/opendata-api";

import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

export function useConfiguration() {
  const configurationParameters = useEmployeePortalApiConfiguration(
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
