/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiBusinessModule } from "@eshg/employee-portal-api/businessProcedures";
import {
  ApiGetProcedureIdsRequest,
  StatisticsProcedureReferenceApiInterface,
} from "@eshg/employee-portal-api/libStatistics";
import { queryOptions } from "@tanstack/react-query";

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
