/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseFeatureTogglesApi,
  BundIdPersonLinkApi,
  Configuration,
  MukFacilityLinkApi,
} from "@eshg/citizen-portal-api/base";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_BASE_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useFeatureTogglesApi() {
  return new BaseFeatureTogglesApi(useConfiguration());
}

export function useMukFacilityLinkApi() {
  return new MukFacilityLinkApi(useConfiguration());
}

export function useBundIdPersonLinkApi() {
  return new BundIdPersonLinkApi(useConfiguration());
}
