/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Configuration, OpenDataPublicCitizenApi } from "@eshg/opendata-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
    "PUBLIC_OPEN_DATA_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useOpenDataPublicCitizenApi() {
  return new OpenDataPublicCitizenApi(useConfiguration());
}
