/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FilterValue } from "@eshg/lib-employee-portal";
import { FormikValues } from "formik";

export interface SetFiltersStepFormModel extends FormikValues {
  filterValues: FilterValue[];
}
