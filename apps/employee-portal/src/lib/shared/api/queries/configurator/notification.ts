/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiGetNotificationConfigResponse } from "@eshg/travel-medicine-api";

import { NotificationFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/Notification";
import { useNotificationConfigApi } from "@/lib/shared/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetNotificationConfig() {
  const notificationConfigApi = useNotificationConfigApi();

  const result = useSuspenseQuery({
    queryKey: configuratorApiQueryKey(["getNotificationConfig"]),
    queryFn: () => notificationConfigApi.getNotificationConfig(),
    select: (data: ApiGetNotificationConfigResponse) =>
      ({
        fromAddress: data.notificationConfigDto?.fromAddress ?? "",
        greeting: data.notificationConfigDto?.greeting ?? "",
      }) satisfies NotificationFormModel,
  });
  return result.data;
}
