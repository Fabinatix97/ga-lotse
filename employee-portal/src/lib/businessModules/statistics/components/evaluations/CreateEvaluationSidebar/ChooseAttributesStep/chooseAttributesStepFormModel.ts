/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

export interface ChooseAttributesStepFormModel extends FormikValues {
  selectedAttributeKeys?: Set<string>;
}
