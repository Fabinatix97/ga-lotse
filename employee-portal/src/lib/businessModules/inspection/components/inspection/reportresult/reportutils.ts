/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiInspection,
  ApiInspectionResult,
} from "@eshg/employee-portal-api/inspection";
import { isNonNullish } from "remeda";

export function inspectionHasResult(inspection: ApiInspection) {
  return (
    isNonNullish(inspection.result) &&
    inspection.result !== ApiInspectionResult.Open
  );
}
