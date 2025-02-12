/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonNullish } from "remeda";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  booleanOptions,
  mapEnumOptions,
} from "@/lib/businessModules/statistics/components/evaluations/details/filter/enumFilterMappings";
import { EnumFilterDefinition } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { NumberFilterDefinition } from "@/lib/shared/components/filterSettings/models/NumberFilter";
import { TextFilterDefinition } from "@/lib/shared/components/filterSettings/models/TextFilter";

export function mapAttributesToFilterDefinitions(
  attributes: FlatAttribute[],
): FilterDefinition[] {
  return attributes
    .map((attribute) => {
      switch (attribute.type) {
        case "ValueWithOptionsAttribute":
          return {
            type: "Enum",
            key: attribute.key,
            name: attribute.name,
            options: mapEnumOptions(attribute.valueOptions),
          } satisfies EnumFilterDefinition;
        case "BooleanAttribute":
          return {
            type: "Enum",
            key: attribute.key,
            name: attribute.name,
            options: booleanOptions,
          } satisfies EnumFilterDefinition;
        case "DecimalAttribute":
        case "IntegerAttribute":
          return {
            type: "Number",
            key: attribute.key,
            name: attribute.name,
            minValue: attribute.minValue,
            maxValue: attribute.maxValue,
            unit: attribute.unit,
          } satisfies NumberFilterDefinition;
        case "TextAttribute":
          return {
            type: "Text",
            key: attribute.key,
            name: attribute.name,
            inAccordion: true,
          } satisfies TextFilterDefinition;
      }
    })
    .filter(isNonNullish);
}
