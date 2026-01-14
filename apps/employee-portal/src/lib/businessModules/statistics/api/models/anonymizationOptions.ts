/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDataSourceSensitivity } from "@eshg/statistics-api";

export const AnonymizationOptions = {
  Choice: "CHOICE",
  AlwaysAnonymize: "ALWAYS_ANONYMIZE",
  NotAnonymizable: "NOT_ANONYMIZABLE",
  AlwaysInternal: "ALWAYS_INTERNAL",
  Neither: "NEITHER",
} as const;
export type AnonymizationOptions =
  (typeof AnonymizationOptions)[keyof typeof AnonymizationOptions];

export function mapToAnonymizationOptions({
  dataSourceSensitivity,
  canBeAnonymized,
  sensitiveDataAllowed,
  tooManyQuasiIdentifyingAttributes,
}: {
  dataSourceSensitivity: ApiDataSourceSensitivity | undefined;
  canBeAnonymized: boolean;
  sensitiveDataAllowed: boolean;
  tooManyQuasiIdentifyingAttributes?: boolean;
}): AnonymizationOptions {
  if (canBeAnonymized) {
    if (
      dataSourceSensitivity === ApiDataSourceSensitivity.Sensitive &&
      !sensitiveDataAllowed
    ) {
      if (tooManyQuasiIdentifyingAttributes) {
        return AnonymizationOptions.Neither;
      }
      return AnonymizationOptions.AlwaysAnonymize;
    } else {
      if (tooManyQuasiIdentifyingAttributes) {
        return AnonymizationOptions.AlwaysInternal;
      }
      return AnonymizationOptions.Choice;
    }
  } else {
    return AnonymizationOptions.NotAnonymizable;
  }
}
