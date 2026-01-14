/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isArray, isPlainObject } from "remeda";

import { ApiUpdateChecklistElementsInner } from "@eshg/inspection-api";

// Recursively update all objects with matching id and type.
// Note that array properties are updated, not overwritten.
export function replaceRecursive<T, U extends ApiUpdateChecklistElementsInner>(
  input: T,
  update: U,
): T {
  if (isArray(input)) {
    return input.map((element) => replaceRecursive(element, update)) as T;
  }
  if (isPlainObject(input)) {
    if (
      "id" in input &&
      "type" in input &&
      input.id === update.id &&
      input.type === update.type
    ) {
      const keys = [...Object.keys(input), ...Object.keys(update)];
      return Object.fromEntries(
        keys.map((k) => {
          const updateRecord = update as unknown as Record<string, unknown>;
          if (
            k in input &&
            k in update &&
            isArray(input[k]) &&
            isArray(updateRecord[k])
          ) {
            // remove entries with duplicate imageID here?
            return [k, [...input[k], ...updateRecord[k]]];
          }
          return [k, updateRecord[k] ?? input[k]];
        }),
      ) as T;
    }
    return Object.fromEntries(
      Object.entries(input).map(([k, v]) => [k, replaceRecursive(v, update)]),
    ) as T;
  }
  return input;
}
