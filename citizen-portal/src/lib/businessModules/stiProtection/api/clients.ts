/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import { CitizenPublicApi, Configuration } from "@eshg/sti-protection-api";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_STI_PROTECTION_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

// export function useCitizenPrivateApi() {
//   const configuration = useConfiguration();
//   return new CitizenPrivateApi(configuration);
// }

export function useCitizenPublicApi() {
  const configuration = useConfiguration();
  return new CitizenPublicApi(configuration);
}
