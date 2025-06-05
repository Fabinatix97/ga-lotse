/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  OrganisationPortalApi,
} from "@eshg/measles-protection-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
    "PUBLIC_MEASLES_PROTECTION_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useOrganisationPortalApi(): OrganisationPortalApi {
  return new OrganisationPortalApi(useConfiguration());
}
