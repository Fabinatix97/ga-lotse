/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { queryOptions } from "@tanstack/react-query";

import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import {
  ApiGetProcedureIdsRequest,
  StatisticsProcedureReferenceApiInterface,
} from "@eshg/lib-statistics-api";

import { gdprValidationTaskApiQueryKey } from "@/lib/baseModule/api/queries/apiQueryKey";

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
    queryKey: gdprValidationTaskApiQueryKey([
      businessModule,
      "getProcedureIds",
      request,
    ]),
    queryFn: () => statisticsProcedureReferenceApi.getProcedureIds(request),
  });
}
