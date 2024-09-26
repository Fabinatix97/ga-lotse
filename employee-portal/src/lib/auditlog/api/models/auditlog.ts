/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAuditLogGrantedAccessCount,
  ApiAuditLogSource,
  ApiGetAvailableAuditLogsResponse,
} from "@eshg/employee-portal-api/auditlog/models";

interface GetAvailableAuditLogsResponse {
  logs: AuditLog[];
  totalElements: number;
  totalPages: number;
}

export interface AuditLog {
  readonly auditLogSource: ApiAuditLogSource;
  readonly createdAt: Date;
  readonly validGrantedAccessCount: number;
}

export function mapResponse(
  response: ApiGetAvailableAuditLogsResponse,
): GetAvailableAuditLogsResponse {
  return {
    logs: response.logs.map(mapAuditLog),
    totalElements: response.totalElements,
    totalPages: response.totalPages,
  };
}

function mapAuditLog(log: ApiAuditLogGrantedAccessCount): AuditLog {
  return {
    auditLogSource: log.auditLog.source,
    createdAt: log.auditLog.date,
    validGrantedAccessCount: log.validGrantedAccessCount,
  };
}
