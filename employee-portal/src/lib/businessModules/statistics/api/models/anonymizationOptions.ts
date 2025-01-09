/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDataSourceSensitivity } from "@eshg/employee-portal-api/statistics";

export const AnonymizationOptions = {
  Choice: "CHOICE",
  AlwaysAnonymize: "ALWAYS_ANONYMIZE",
  NotAnonymizable: "NOT_ANONYMIZABLE",
} as const;
export type AnonymizationOptions =
  (typeof AnonymizationOptions)[keyof typeof AnonymizationOptions];

export function mapToAnonymizationOptions({
  dataSourceSensitivity,
  canBeAnonymized,
  sensitiveDataAllowed,
}: {
  dataSourceSensitivity: ApiDataSourceSensitivity | undefined;
  canBeAnonymized: boolean;
  sensitiveDataAllowed: boolean;
}): AnonymizationOptions {
  if (canBeAnonymized) {
    if (
      dataSourceSensitivity === ApiDataSourceSensitivity.Sensitive &&
      !sensitiveDataAllowed
    ) {
      return AnonymizationOptions.AlwaysAnonymize;
    } else {
      return AnonymizationOptions.Choice;
    }
  } else {
    return AnonymizationOptions.NotAnonymizable;
  }
}
