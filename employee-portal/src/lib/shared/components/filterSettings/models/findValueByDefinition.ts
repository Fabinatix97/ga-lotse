/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterDraftValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

export type DraftValueByDefinition<TDefinition extends FilterDefinition> =
  Extract<FilterDraftValue, { type: TDefinition["type"] }>;

export function findValueByDefinition<TDefinition extends FilterDefinition>(
  values: FilterDraftValue[],
  definition: TDefinition,
): DraftValueByDefinition<TDefinition> | null {
  const value = values.find(
    (value) => value.key === definition.key && value.type === definition.type,
  );

  return (value ?? null) as DraftValueByDefinition<TDefinition> | null;
}
