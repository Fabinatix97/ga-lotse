/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiBusinessModule,
  ApiGetGdprNotificationBannerResponse,
  GdprValidationTaskApiInterface,
  GetAllGdprValidationTasksRequest,
} from "@eshg/employee-portal-api/businessProcedures";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions } from "@tanstack/react-query";

import { gdprValidationTaskApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

export function getGdprValidationBannerQuery(
  taskApi: GdprValidationTaskApiInterface,
  businessModule: ApiBusinessModule,
  isFeatureEnabled: boolean,
) {
  return queryOptions({
    queryKey: gdprValidationTaskApiQueryKey([
      businessModule,
      "getGdprNotificationBanner",
      isFeatureEnabled,
    ]),
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

export function getGdprValidationTaskDetailsQuery(
  taskApi: GdprValidationTaskApiInterface,
  businessModule: ApiBusinessModule,
  id: string,
) {
  return queryOptions({
    queryKey: gdprValidationTaskApiQueryKey([
      businessModule,
      "getGdprValidationTaskDetails",
      id,
    ]),
    queryFn: () => taskApi.getGdprValidationTaskDetails(id),
  });
}

export function getGdprValidationTasksQuery(
  taskApi: GdprValidationTaskApiInterface,
  businessModule: ApiBusinessModule,
  request: GetAllGdprValidationTasksRequest,
) {
  return queryOptions({
    queryKey: gdprValidationTaskApiQueryKey([
      businessModule,
      "getGdprValidationTasks",
      request,
    ]),
    queryFn: () =>
      taskApi.getAllGdprValidationTasksRaw(request).then(unwrapRawResponse),
  });
}
