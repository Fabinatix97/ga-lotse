/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  validateLength,
  validatePipe,
  validateRegex,
} from "@eshg/lib-portal/helpers/validators";

const phoneNumberRegex = new RegExp(/^(\+[1-9])?[-+0-9 ]+$/);
const chatUsernameRegex = new RegExp(/^\p{ASCII}+$/u);

export const phoneNumberValidator = validatePipe(
  validateLength(1, 23),
  validateRegex(phoneNumberRegex, "Bitte eine gültige Telefonnummer angeben."),
);

export const chatUsernameValidator = validatePipe(
  validateLength(1, 255),
  validateRegex(
    chatUsernameRegex,
    "Bitte einen gültigen Benutzernamen angeben.",
  ),
);
