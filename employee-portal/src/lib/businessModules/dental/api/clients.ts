/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Configuration } from "@eshg/employee-portal-api/dental";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

// eslint-disable-next-line unused-imports/no-unused-vars
function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_DENTAL_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}
