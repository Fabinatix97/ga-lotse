/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Configuration as BaseConfiguration, UserApi } from "@eshg/base-api";
import {
  ChatFeatureTogglesApi,
  Configuration as ChatManagementConfiguration,
  UserAccountApi,
  UserSettingsApi,
} from "@eshg/chat-management-api";

import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

function useChatManagementConfiguration() {
  const configurationParameters = useEmployeePortalApiConfiguration(
    "PUBLIC_CHAT_MANAGEMENT_BACKEND_URL",
  );

  return new ChatManagementConfiguration(configurationParameters);
}

function useBaseConfiguration() {
  const configurationParameters = useEmployeePortalApiConfiguration(
    "PUBLIC_BASE_BACKEND_URL",
  );

  return new BaseConfiguration(configurationParameters);
}

export function useUserSettingsApi() {
  const configuration = useChatManagementConfiguration();
  return new UserSettingsApi(configuration);
}

export function useFeatureTogglesApi() {
  const configuration = useChatManagementConfiguration();
  return new ChatFeatureTogglesApi(configuration);
}

export function useUserAccountApi() {
  const configuration = useChatManagementConfiguration();
  return new UserAccountApi(configuration);
}

export function useSelfUserApi() {
  const configuration = useBaseConfiguration();
  return new UserApi(configuration);
}
