/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiBusinessModule,
  ApiGetGdprNotificationBannerResponse,
  GdprValidationTaskApiInterface,
} from "@eshg/lib-procedures-api";
import { queryOptions } from "@tanstack/react-query";

import { gdprValidationTaskApi } from "@/config/apiQueryKeys";

export function useGetGdprValidationBannerQuery(
  businessModule: ApiBusinessModule,
  taskApi: GdprValidationTaskApiInterface,
) {
  return queryOptions({
    queryKey: gdprValidationTaskApi([
      businessModule,
      "getGdprNotificationBanner",
    ]),
    queryFn: async (): Promise<ApiGetGdprNotificationBannerResponse> => {
      return await taskApi.getGdprNotificationBanner();
    },
  });
}
