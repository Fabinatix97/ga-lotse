/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FilterDefinition,
  getDefinitionByValue,
} from "@eshg/lib-employee-portal";
import { isDefined } from "remeda";

import { SupportedEvaluationFilterValues } from "./supportedEvaluationFilterValues";

const includeNullString = "leere Felder";

function createNumberFilterLabels(
  name: string,
  unit: string | undefined,
  value: string,
  includeNull: boolean,
) {
  if (isDefined(unit)) {
    return includeNull
      ? `${name} (${unit}) ${value}, ${includeNullString}`
      : `${name} (${unit}) ${value}`;
  }
  return includeNull
    ? `${name} ${value}, ${includeNullString}`
    : `${name} ${value}`;
}

export function getActiveFilterLabels(
  filterValues: SupportedEvaluationFilterValues[] | undefined,
  filterDefinitions: FilterDefinition[],
) {
  if (isDefined(filterValues) && filterValues.length > 0) {
    return filterValues.map((filterValue) => {
      if (filterValue.type === "Enum") {
        const definition = getDefinitionByValue(filterDefinitions, filterValue);
        return `${definition.name}: ${filterValue.selectedValues.map((value) => definition.options.find((option) => option.value === value)!.label).join(", ")}`;
      } else if (filterValue.type === "Text") {
        const definition = getDefinitionByValue(filterDefinitions, filterValue);
        return `${definition.name}: ${filterValue.value}`;
      } else if (filterValue.type === "Number") {
        const includeNull =
          filterValue.comparison.nullInclusion === "INCLUDE_NULL";
        const definition = getDefinitionByValue(filterDefinitions, filterValue);
        switch (filterValue.comparison.type) {
          case "RANGE":
            const min = filterValue.comparison.minValueInclusive;
            const max = filterValue.comparison.maxValueInclusive;
            return createNumberFilterLabels(
              definition.name,
              definition.unit,
              `[${min},${max}]`,
              includeNull,
            );
          case "VALUE":
            const value = filterValue.comparison.value;
            switch (filterValue.comparison.numericComparison) {
              case "EQUAL":
                return createNumberFilterLabels(
                  definition.name,
                  definition.unit,
                  `= ${value}`,
                  includeNull,
                );
              case "GREATER_EQUAL":
                return createNumberFilterLabels(
                  definition.name,
                  definition.unit,
                  `>= ${value}`,
                  includeNull,
                );
              case "GREATER_THAN":
                return createNumberFilterLabels(
                  definition.name,
                  definition.unit,
                  `> ${value}`,
                  includeNull,
                );
              case "LESS_EQUAL":
                return createNumberFilterLabels(
                  definition.name,
                  definition.unit,
                  `<= ${value}`,
                  includeNull,
                );
              case "LESS_THAN":
                return createNumberFilterLabels(
                  definition.name,
                  definition.unit,
                  `< ${value}`,
                  includeNull,
                );
            }
          case "NULL":
            if (isDefined(definition.unit)) {
              return `${definition.name} (${definition.unit}): ${includeNullString}`;
            }
            return `${definition.name}: ${includeNullString}`;
        }
      }
    });
  } else {
    return ["keine Filter ausgewählt"];
  }
}
