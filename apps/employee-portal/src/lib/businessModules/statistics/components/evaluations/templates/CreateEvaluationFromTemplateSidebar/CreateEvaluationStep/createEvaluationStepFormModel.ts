/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { AnonymizationOptions } from "@/lib/businessModules/statistics/api/models/anonymizationOptions";
import { AnonymizedFieldValue } from "@/lib/businessModules/statistics/components/evaluations/AnonymizationConfiguration";
import { TimeSpan } from "@/lib/shared/components/formFields/TimeSpanField";

export interface CreateEvaluationStepFormModel extends FormikValues {
  name: string;
  timeSpan: TimeSpan;
  anonymized: AnonymizedFieldValue;
  anonymizationOptions?: AnonymizationOptions;
}
