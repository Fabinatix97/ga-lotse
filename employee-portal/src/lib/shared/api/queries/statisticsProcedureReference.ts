/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryOptions } from "@tanstack/react-query";

import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import {
  ApiGetProcedureIdsRequest,
  StatisticsProcedureReferenceApiInterface,
} from "@eshg/lib-statistics-api";

const statisticsProcedureReferenceApiQueryKey = queryKeyFactory([
  "lib-statistics",
  "statisticsProcedureReferenceApi",
]);

export function getProcedureIdsQuery({
  statisticsProcedureReferenceApi,
  businessModule,
  request,
}: {
  statisticsProcedureReferenceApi: StatisticsProcedureReferenceApiInterface;
  businessModule: ApiBusinessModule;
  request: ApiGetProcedureIdsRequest;
}) {
  return queryOptions({
    queryKey: statisticsProcedureReferenceApiQueryKey([
      businessModule,
      "getProcedureIds",
      request,
    ]),
    queryFn: () => statisticsProcedureReferenceApi.getProcedureIds(request),
  });
}
