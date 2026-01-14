/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiAuditLogSource,
  GetAuditLogGrantedAccessesRequest,
  GetAuditLogGranteesCandidatesRequest,
  GetAvailableLogsRequest,
} from "@eshg/auditlog-api";
import { unwrapRawResponse } from "@eshg/lib-portal";

import { useAuditlogApi } from "@/lib/auditlog/api/clients";
import { mapResponse } from "@/lib/auditlog/api/models/auditlog";
import { auditLogApiQueryKey } from "@/lib/auditlog/queries/queryKeys";

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
    queryKey: auditLogApiQueryKey([
      "available",
      request,
      Array.from(request.source ?? new Set()),
    ]),
    queryFn: () =>
      auditlogApi.getAvailableLogsRaw(request).then(unwrapRawResponse),
    select: mapResponse,
  });
}

export function useGetAuditLogGranteesCandidates(
  source: ApiAuditLogSource,
  date: Date,
) {
  const auditlogApi = useAuditlogApi();

  const request: GetAuditLogGranteesCandidatesRequest = {
    source: source,
    date: date,
  };

  return useSuspenseQuery({
    queryKey: auditLogApiQueryKey(["granteesCandidates", request]),
    queryFn: () =>
      auditlogApi
        .getAuditLogGranteesCandidatesRaw(request)
        .then(unwrapRawResponse),
  });
}

export function useGetAuditLogGrantedAccesses(
  source: ApiAuditLogSource,
  date: Date,
) {
  const auditlogApi = useAuditlogApi();

  const request: GetAuditLogGrantedAccessesRequest = {
    source: source,
    date: date,
  };

  return useSuspenseQuery({
    queryKey: auditLogApiQueryKey(["grantAccess", request]),
    queryFn: () =>
      auditlogApi
        .getAuditLogGrantedAccessesRaw(request)
        .then(unwrapRawResponse),
  });
}

export function useGetAccessibleAuditLogs() {
  const auditlogApi = useAuditlogApi();

  return useSuspenseQuery({
    queryKey: auditLogApiQueryKey(["accessible"]),
    queryFn: () => auditlogApi.getAccessibleAuditLogs(),
  });
}
