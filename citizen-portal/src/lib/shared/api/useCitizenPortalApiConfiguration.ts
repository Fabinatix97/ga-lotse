/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationParameters } from "@eshg/base-api";
import {
  ApiConfiguration,
  useApiConfiguration,
} from "@eshg/lib-portal/api/ApiProvider";

import { useLang } from "@/lib/i18n/useLang";

export function useCitizenPortalApiConfiguration(
  basePathName: keyof ApiConfiguration,
): ConfigurationParameters {
  const lang = useLang();
  return useApiConfiguration(basePathName, lang);
}
