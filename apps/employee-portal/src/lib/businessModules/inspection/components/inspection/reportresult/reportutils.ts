/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonNullish } from "remeda";

import { ApiInspection, ApiInspectionResult } from "@eshg/inspection-api";

export function inspectionHasResult(inspection: ApiInspection) {
  return (
    isNonNullish(inspection.result) &&
    inspection.result !== ApiInspectionResult.Open
  );
}
