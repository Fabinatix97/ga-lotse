/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AuditLogApi, Configuration } from "@eshg/employee-portal-api/auditlog";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_AUDITLOG_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useAuditlogApi() {
  const configuration = useConfiguration();
  return new AuditLogApi(configuration);
}
