/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Configuration, OpenDataApi } from "@eshg/employee-portal-api/opendata";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_OPENDATA_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useOpenDataApi() {
  return new OpenDataApi(useConfiguration());
}
