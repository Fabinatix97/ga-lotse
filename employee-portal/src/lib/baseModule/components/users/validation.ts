/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  validatePipe,
  validateRegex,
} from "@eshg/lib-portal/helpers/validators";
import { useValidateLength } from "@eshg/lib-portal/hooks/useValidators";

const phoneNumberRegex = new RegExp(/^(\+[1-9])?[-+0-9 ]+$/);

export function usePhoneNumberValidator() {
  const validateLength = useValidateLength();

  return validatePipe(
    validateLength(1, 23),
    validateRegex(
      phoneNumberRegex,
      "Bitte eine gültige Telefonnummer angeben.",
    ),
  );
}
