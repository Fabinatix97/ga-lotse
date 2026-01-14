/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAuditLogGrantedAccessCount,
  ApiAuditLogSource,
  ApiGetAvailableAuditLogsResponse,
} from "@eshg/auditlog-api";

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
