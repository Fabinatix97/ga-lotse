/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined, isEmpty, isNullish } from "remeda";

import { Nullable } from "../types/utility";

interface NamedPerson {
  firstName: string;
  lastName: string;
}

export function formatPersonName(
  person: Nullable<Partial<NamedPerson>>,
  fallbackValue = "",
) {
  if (
    isNullish(person) ||
    !(isDefined(person.firstName) || isDefined(person.lastName))
  ) {
    return fallbackValue;
  }

  if (
    isDefined(person.firstName) &&
    (!isDefined(person.lastName) || isEmpty(person.lastName))
  ) {
    return person.firstName;
  }

  if (
    (!isDefined(person.firstName) || isEmpty(person.firstName)) &&
    isDefined(person.lastName)
  ) {
    return person.lastName;
  }

  return `${person.firstName} ${person.lastName}`;
}

const UNKNOWN_USER = "Unbekannter Benutzer";

export function formatUserName(user: Nullable<Partial<NamedPerson>>): string {
  return formatPersonName(user, UNKNOWN_USER);
}
