/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AuditLogApi,
  AuditLogFeatureTogglesApi,
  Configuration,
} from "@eshg/employee-portal-api/auditlog";
import { useApiConfiguration } from "@eshg/lib-portal/api/ApiProvider";

function useConfiguration() {
  const configurationParameters = useApiConfiguration(
    "PUBLIC_AUDITLOG_BACKEND_URL",
  );
  return new Configuration(configurationParameters);
}

export function useAuditlogApi() {
  return new AuditLogApi(useConfiguration());
}

export function useFeatureTogglesApi() {
  return new AuditLogFeatureTogglesApi(useConfiguration());
}
