/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ChatFeatureTogglesApi,
  Configuration,
  UserSettingsApi,
} from "@eshg/chat-management-api";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_CHAT_MANAGEMENT_BACKEND_URL",
  );

  return new Configuration(configurationParameters);
}

export function useUserSettingsApi() {
  const configuration = useConfiguration();
  return new UserSettingsApi(configuration);
}

export function useFeatureTogglesApi() {
  const configuration = useConfiguration();
  return new ChatFeatureTogglesApi(configuration);
}
