/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CitizenApi,
  CitizenPublicApi,
  Configuration,
} from "@eshg/sti-protection-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
    "PUBLIC_STI_PROTECTION_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

// export function useCitizenPrivateApi() {
//   const configuration = useConfiguration();
//   return new CitizenPrivateApi(configuration);
// }

export function useCitizenApi() {
  const configuration = useConfiguration();
  return new CitizenApi(configuration);
}

export function useCitizenPublicApi() {
  const configuration = useConfiguration();
  return new CitizenPublicApi(configuration);
}
