/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  OrganisationPortalApi,
} from "@eshg/citizen-portal-api/measlesProtection";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_MEASLES_PROTECTION_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useOrganisationPortalApi(): OrganisationPortalApi {
  return new OrganisationPortalApi(useConfiguration());
}
