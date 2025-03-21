/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined, isEmpty, isNullish } from "remeda";

import { Nullable } from "../types/utility";

interface Person {
  firstName: string;
  lastName: string;
}

export function formatPersonName(person: Nullable<Partial<Person>>) {
  if (
    isNullish(person) ||
    !(isDefined(person.firstName) || isDefined(person.lastName))
  ) {
    return "";
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
