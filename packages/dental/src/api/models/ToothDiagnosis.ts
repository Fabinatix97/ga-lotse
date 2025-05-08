/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiMainResult,
  ApiSecondaryResult,
  ApiTooth,
  ApiToothDiagnosis,
} from "@eshg/dental-api";

export interface ToothDiagnosis {
  readonly tooth: ApiTooth;
  readonly mainResult?: ApiMainResult;
  readonly secondaryResult?: ApiSecondaryResult;
}

export function mapToothDiagnosis(response: ApiToothDiagnosis): ToothDiagnosis {
  return {
    tooth: response.tooth,
    mainResult: response.mainResult,
    secondaryResult: response.secondaryResult,
  };
}
