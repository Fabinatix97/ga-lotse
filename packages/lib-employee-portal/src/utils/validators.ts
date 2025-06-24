/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormikErrors } from "formik";
import { isEmpty } from "remeda";

export function validateFieldArray<TItem>(
  items: TItem[],
  validateFn: (item: TItem) => FormikErrors<TItem>,
) {
  const arrayErrors = items.map(validateFn);

  if (arrayErrors.every((itemErrors) => isEmpty(itemErrors))) {
    return undefined;
  }

  return arrayErrors;
}
