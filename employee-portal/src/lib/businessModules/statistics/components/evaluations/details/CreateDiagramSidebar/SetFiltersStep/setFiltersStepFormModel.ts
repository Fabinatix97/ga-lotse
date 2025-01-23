/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikValues } from "formik";

import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

export interface SetFiltersStepFormModel extends FormikValues {
  filterValues: FilterValue[];
}
