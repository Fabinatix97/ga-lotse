/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiExaminationResult } from "@eshg/dental-api";
import { isDefined } from "remeda";

export type ExaminationStatus = "OPEN" | "CLOSED" | "NOT_PRESENT";

export function mapToExaminationStatus(
  examinationResult: ApiExaminationResult | undefined,
): ExaminationStatus {
  if (examinationResult?.type === "AbsenceExaminationResult") {
    return "NOT_PRESENT";
  }
  return isDefined(examinationResult) ? "CLOSED" : "OPEN";
}
