/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  SchoolEntryCitizenApi,
  SchoolEntryPublicCitizenApi,
} from "@eshg/school-entry-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
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
