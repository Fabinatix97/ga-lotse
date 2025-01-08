/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

export type DefinitionByValue<TValue extends FilterValue> = Extract<
  FilterDefinition,
  { type: TValue["type"] }
>;

export function getDefinitionByValue<TValue extends FilterValue>(
  definitions: FilterDefinition[],
  value: TValue,
): DefinitionByValue<TValue> {
  const definition = definitions.find(
    (definition) =>
      value.key === definition.key && value.type === definition.type,
  );

  if (definition === undefined) {
    throw new Error(
      "This case should not occur, filter definition and value should always have matching keys.",
    );
  }

  return definition as DefinitionByValue<TValue>;
}
