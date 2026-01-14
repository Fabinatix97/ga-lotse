/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { FilterValue } from "@eshg/lib-employee-portal";

export interface SetFiltersStepFormModel extends FormikValues {
  filterValues: FilterValue[];
}
