/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspectionFeature } from "@eshg/employee-portal-api/inspection";

import { useIsNewFeatureEnabledUnsuspended } from "@/lib/businessModules/inspection/api/queries/feature";

export function useIsOfflineFeatureEnabled() {
  const { isSuccess: isOfflineQuerySuccess, data: isOfflineFTEnabled } =
    useIsNewFeatureEnabledUnsuspended(ApiInspectionFeature.Offline);
  // The offline feature is opt-out. default to true.
  return !isOfflineQuerySuccess || isOfflineFTEnabled;
}
