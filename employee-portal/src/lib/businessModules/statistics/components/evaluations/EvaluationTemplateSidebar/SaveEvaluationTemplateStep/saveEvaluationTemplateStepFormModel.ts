/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

export interface SaveEvaluationTemplateStepFormModel extends FormikValues {
  name: string;
  description: string;
}
