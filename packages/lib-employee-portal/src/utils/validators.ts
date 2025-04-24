/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiCountryCode } from "@eshg/base-api";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";

export function validateZipCode(country: ApiCountryCode) {
  switch (country) {
    case ApiCountryCode.De:
      return validateGermanZipCode;
    default:
      return () => undefined;
  }
}

function validateGermanZipCode(value: string) {
  if (value === undefined || isEmptyString(value)) {
    return undefined;
  }

  if (!/^[0-9]{5}$/.test(value)) {
    return "Bitte eine gültige Postleitzahl angeben.";
  }

  return undefined;
}
