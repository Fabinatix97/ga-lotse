/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Configuration,
  InfectionBriefingPublicCitizenApi,
} from "@eshg/infection-briefing-api";

import { useCitizenPortalApiConfiguration } from "@/lib/shared/api/useCitizenPortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useCitizenPortalApiConfiguration(
    "PUBLIC_INFECTION_BRIEFING_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useInfectionBriefingPublicCitizenApi() {
  const configuration = useConfiguration();
  return new InfectionBriefingPublicCitizenApi(configuration);
}
