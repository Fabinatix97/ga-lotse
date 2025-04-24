/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinition } from "@/features/filters/types/FilterDefinition";
import { FilterDraftValue } from "@/features/filters/types/FilterValue";

type DraftValueByDefinition<TDefinition extends FilterDefinition> = Extract<
  FilterDraftValue,
  { type: TDefinition["type"] }
>;

export function findValueByDefinition<TDefinition extends FilterDefinition>(
  values: FilterDraftValue[],
  definition: TDefinition,
): DraftValueByDefinition<TDefinition> | null {
  const value = values.find(
    (value) => value.key === definition.key && value.type === definition.type,
  );

  return (value ?? null) as DraftValueByDefinition<TDefinition> | null;
}
