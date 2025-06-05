/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMarkNotificationsAsReadRequest } from "@eshg/base-api";
import { useHandledMutation } from "@eshg/lib-portal";

import { useNotificationAggregationApi } from "@/lib/baseModule/api/clients";

export function useMarkNotificationsAsRead() {
  const notificationAggregationApi = useNotificationAggregationApi();
  return useHandledMutation({
    mutationFn: (notificationIds: ApiMarkNotificationsAsReadRequest) =>
      notificationAggregationApi.markNotificationsAsRead(notificationIds),
  });
}
