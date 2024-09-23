/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAuditLogSource,
  GetAvailableLogsRequest,
  GetValidAuditLogGranteesRequest,
} from "@eshg/employee-portal-api/auditlog";
import { queryKeyFactory } from "@eshg/lib-portal/api/queryKeyFactory";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useAuditlogApi } from "@/lib/auditlog/api/clients";
import { mapResponse } from "@/lib/auditlog/api/models/auditlog";

const auditlogQueryKey = queryKeyFactory(["auditlog"]);

export const SearchParamsKeys = {
  source: "source",
  startDate: "startDate",
  endDate: "endDate",
  pageSize: "pageSize",
  pageNumber: "pageNumber",
};

interface SearchParams {
  source?: Set<ApiAuditLogSource>;
  startDate?: string;
  endDate?: string;
  pageSize?: number;
  pageNumber?: number;
}

export function useGetAvailableAuditLogs(params: SearchParams) {
  const auditlogApi = useAuditlogApi();

  const request: GetAvailableLogsRequest = {
    source: params.source,
    startDate: params.startDate ? new Date(params.startDate) : undefined,
    endDate: params.endDate ? new Date(params.endDate) : undefined,
    pageSize: params.pageSize,
    pageNumber: params.pageNumber,
  };

  return useSuspenseQuery({
    queryKey: auditlogQueryKey([
      "available",
      request,
      Array.from(request.source ?? new Set()),
    ]),
    queryFn: () =>
      auditlogApi.getAvailableLogsRaw(request).then(unwrapRawResponse),
    select: mapResponse,
  });
}

export function useGetGetValidAuditLogGrantees(
  source: ApiAuditLogSource,
  date: Date,
) {
  const auditlogApi = useAuditlogApi();

  const request: GetValidAuditLogGranteesRequest = {
    source: source,
    date: date,
  };

  return useSuspenseQuery({
    queryKey: auditlogQueryKey(["grantees", request]),
    queryFn: () =>
      auditlogApi.getValidAuditLogGranteesRaw(request).then(unwrapRawResponse),
  });
}
