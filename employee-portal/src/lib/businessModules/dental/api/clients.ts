/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ChildApi,
  Configuration,
  ProphylaxisSessionApi,
} from "@eshg/employee-portal-api/dental";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_DENTAL_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useChildApi() {
  const configuration = useConfiguration();
  return new ChildApi(configuration);
}

export function useProphylaxisSessionApi() {
  const configuration = useConfiguration();
  return new ProphylaxisSessionApi(configuration);
}
