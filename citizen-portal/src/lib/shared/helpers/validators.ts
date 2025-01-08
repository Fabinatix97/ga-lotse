/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isValidEmailString } from "@eshg/lib-portal/helpers/email";
import {
  isEmptyString,
  isNonEmptyString,
} from "@eshg/lib-portal/helpers/guards";

export function validateEmail(value: string, message?: string) {
  if (
    value === undefined ||
    isEmptyString(value) ||
    isValidEmailString(value)
  ) {
    return undefined;
  }

  return isNonEmptyString(message)
    ? message
    : "Bitte eine gültige Email angeben.";
}
