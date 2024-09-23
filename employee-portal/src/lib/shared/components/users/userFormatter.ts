/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { isNonNullish } from "remeda";

export const unknownUser = "Unbekannter Benutzer";

export function fullName(user: ApiUser | undefined) {
  return isNonNullish(user) ? formatPersonName(user) : unknownUser;
}
