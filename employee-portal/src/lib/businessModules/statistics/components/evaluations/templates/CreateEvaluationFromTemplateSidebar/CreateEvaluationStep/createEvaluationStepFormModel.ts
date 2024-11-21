/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AnonymizedFieldValue } from "@/lib/businessModules/statistics/components/evaluations/AnonymizedToggleButtonGroupField";
import { TimeSpan } from "@/lib/shared/components/formFields/TimeSpanField";

export interface CreateEvaluationStepFormModel {
  name: string;
  timeSpan: TimeSpan;
  anonymized: AnonymizedFieldValue;
}
