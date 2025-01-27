/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";
import {
  Configuration,
  SchoolEntryCitizenApi,
  SchoolEntryPublicCitizenApi,
} from "@eshg/school-entry-api";

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

export function useSchoolEntryPublicCitizenApi() {
  const configuration = useConfiguration();
  return new SchoolEntryPublicCitizenApi(configuration);
}
