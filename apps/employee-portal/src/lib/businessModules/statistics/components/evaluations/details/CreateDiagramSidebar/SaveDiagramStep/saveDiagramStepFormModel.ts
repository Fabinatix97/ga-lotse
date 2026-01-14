/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

export interface SaveDiagramStepFormModel extends FormikValues {
  title: string;
  description: string;
}
