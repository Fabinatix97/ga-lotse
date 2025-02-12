/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { isNonNullish } from "remeda";

export const unknownUser = "Unbekannter Benutzer";

interface NamedUser {
  firstName: string;
  lastName: string;
}

export function fullName(user: NamedUser | undefined) {
  return isNonNullish(user) ? formatPersonName(user) : unknownUser;
}
