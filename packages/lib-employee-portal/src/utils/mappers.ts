/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiProcedureType, ApiUser } from "@eshg/base-api";
import { SelectOption } from "@eshg/lib-portal";

import { PROCEDURE_TYPE_NAMES } from "../translations/procedures";

export function mapToSelectOption(option: string): SelectOption {
  return {
    label: option,
    value: option,
  };
}

export function buildOptionsFromUsers(users: ApiUser[]) {
  return users.map(buildOptionFromUser);
}

export function buildOptionFromUser(user: ApiUser) {
  return {
    label: `${user.firstName} ${user.lastName}`,
    value: user.userId,
  };
}

export function buildOptionsFromProcedureTypes(
  procedureTypes: ApiProcedureType[],
) {
  return procedureTypes.map(buildOptionFromProcedureType);
}

function buildOptionFromProcedureType(procedureType: ApiProcedureType) {
  return { value: procedureType, label: PROCEDURE_TYPE_NAMES[procedureType] };
}

export function toSet<T extends string>(
  list: string[] | undefined,
  mapWithViableValues: Record<string, T>,
): Set<T> | undefined {
  if (list === undefined) {
    return;
  }
  const setValues = Object.values(mapWithViableValues);
  const typedList = list.filter((t): t is T =>
    (setValues as string[]).includes(t),
  );
  if (typedList.length === 0) {
    return;
  }
  return new Set(typedList);
}
