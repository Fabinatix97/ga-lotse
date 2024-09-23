/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiMarkNotificationsAsReadRequest } from "@eshg/employee-portal-api/base";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useNotificationAggregationApi } from "@/lib/baseModule/api/clients";

export function useMarkNotificationsAsRead() {
  const notificationAggregationApi = useNotificationAggregationApi();
  return useHandledMutation({
    mutationFn: (notificationIds: ApiMarkNotificationsAsReadRequest) =>
      notificationAggregationApi.markNotificationsAsRead(notificationIds),
  });
}
