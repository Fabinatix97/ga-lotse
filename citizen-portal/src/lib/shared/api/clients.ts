/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Configuration, DepartmentApi, PublicConfigApi } from "@eshg/base-api";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_BASE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useDepartmentApi() {
  const configuration = useConfiguration();
  return new DepartmentApi(configuration);
}

export function usePublicConfigApi() {
  const configuration = useConfiguration();
  return new PublicConfigApi(configuration);
}
