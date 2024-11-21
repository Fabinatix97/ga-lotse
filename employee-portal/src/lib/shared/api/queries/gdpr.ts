/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiGetGdprNotificationBannerResponse,
  GdprValidationTaskApi,
} from "@eshg/employee-portal-api/schoolEntry";
import { QueryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { queryOptions } from "@tanstack/react-query";

export function getGdprValidationBannerQuery(
  taskApi: GdprValidationTaskApi,
  queryKeyFactory: QueryKeyFactory,
  isFeatureEnabled: boolean,
) {
  return queryOptions({
    queryKey: queryKeyFactory(["getGdprNotificationBanner", isFeatureEnabled]),
    queryFn: async (): Promise<ApiGetGdprNotificationBannerResponse> => {
      if (isFeatureEnabled) {
        return await taskApi.getGdprNotificationBanner();
      } else {
        return {
          openValidationTasksCount: 0,
        };
      }
    },
  });
}
