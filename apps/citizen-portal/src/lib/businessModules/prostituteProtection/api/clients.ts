/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  ProstituteProtectionPublicCitizenApi,
} from "@eshg/prostitute-protection-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
    "PUBLIC_PROSTITUTE_PROTECTION_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useProstituteProtectionCitizenPublicApi() {
  const configuration = useConfiguration();
  return new ProstituteProtectionPublicCitizenApi(configuration);
}
