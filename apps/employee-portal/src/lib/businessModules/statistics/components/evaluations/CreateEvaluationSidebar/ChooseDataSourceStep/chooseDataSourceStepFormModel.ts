/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

export interface ChooseDataSourceStepFormModel extends FormikValues {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  dataSourceId?: string | "CHOOSE_EVALUATION_TEMPLATE";
}
