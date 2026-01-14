/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationParameters } from "@eshg/base-api";
import { ApiConfiguration, useApiConfiguration } from "@eshg/lib-portal";

export function useEmployeePortalApiConfiguration(
  basePathName: keyof ApiConfiguration,
): ConfigurationParameters {
  return useApiConfiguration(basePathName, "de");
}
