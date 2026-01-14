/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AuditLogApi, Configuration } from "@eshg/auditlog-api";

import { useEmployeePortalApiConfiguration } from "@/lib/shared/api/useEmployeePortalApiConfiguration";

function useConfiguration() {
  const configurationParameters = useEmployeePortalApiConfiguration(
    "PUBLIC_AUDITLOG_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useAuditlogApi() {
  const configuration = useConfiguration();
  return new AuditLogApi(configuration);
}
