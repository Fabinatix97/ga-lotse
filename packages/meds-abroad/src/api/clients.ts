/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConfiguration, useApiConfiguration } from "@eshg/lib-portal";
import {
  Configuration,
  ConfigurationParameters,
  MedsAbroadApi,
} from "@eshg/meds-abroad-api";

function useEmployeePortalApiConfiguration(
  basePathName: keyof ApiConfiguration,
): ConfigurationParameters {
  return useApiConfiguration(basePathName, "de");
}

export function useConfiguration() {
  const configParameters = useEmployeePortalApiConfiguration(
    "PUBLIC_MEDS_ABROAD_BACKEND_URL" as keyof ApiConfiguration,
  ); //TODO: Remove this type cast
  return new Configuration(configParameters);
}

export function useMedsAbroadApi() {
  const config = useConfiguration();
  return new MedsAbroadApi(config);
}
