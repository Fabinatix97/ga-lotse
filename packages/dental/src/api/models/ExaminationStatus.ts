/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiExaminationResult } from "@eshg/dental-api";
import { isDefined } from "remeda";

export type ExaminationStatus = "OPEN" | "CLOSED";

export function mapToExaminationStatus(
  examinationResult: ApiExaminationResult | undefined,
): ExaminationStatus {
  return isDefined(examinationResult) ? "CLOSED" : "OPEN";
}
