/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { useNotificationAggregationApi } from "@/lib/baseModule/api/clients";
import { notificationsApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function useGetUnreadNotifications() {
  const notificationAggregationApi = useNotificationAggregationApi();

  return useQuery({
    queryKey: notificationsApiQueryKey(["getUnreadNotifications"]),
    queryFn: () => notificationAggregationApi.getUnreadNotifications(),
    throwOnError: false,
  });
}
