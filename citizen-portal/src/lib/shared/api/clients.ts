/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Configuration } from "@eshg/citizen-portal-api/base";
import {
  DepartmentApi,
  PublicConfigApi,
} from "@eshg/citizen-portal-api/base/apis";
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
