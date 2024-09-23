/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  SchoolEntryCitizenApi,
} from "@eshg/citizen-portal-api/schoolEntry";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_SCHOOL_ENTRY_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useSchoolEntryCitizenApi() {
  const configuration = useConfiguration();
  return new SchoolEntryCitizenApi(configuration);
}
