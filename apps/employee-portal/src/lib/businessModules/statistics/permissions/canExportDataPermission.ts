/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";

export function canExportDataPermission(sensitivity: DataSourceSensitivity) {
  return (
    sensitivity === DataSourceSensitivity.Anonymous ||
    sensitivity === DataSourceSensitivity.InternalUsage
  );
}
