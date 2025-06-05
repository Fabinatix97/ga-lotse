/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { SetStateAction, useCallback, useState } from "react";

import { mapOptionalString } from "@eshg/lib-portal";

import {
  setWindowSearchParams,
  updateSearchParam,
  useSearchParam,
} from "../../../hooks/useSearchParam";
import { defaultDraftValueDateComparisonFilter } from "../components/filterFields/DateComparisonFilter";
import { DateComparisonOperator } from "../types/DateComparisonFilter";
import { FilterDefinition } from "../types/FilterDefinition";
import { FilterValue } from "../types/FilterValue";
import {
  NumberFilterComparisonMode,
  NumberFilterNullInclusion,
  NumberFilterNumericComparison,
} from "../types/NumberFilter";

import { FilterSettingsStateProvider } from "./useFilterSettings";

function compSymbolToEnum(
  comp: string | undefined,
): NumberFilterNumericComparison {
  switch (comp) {
    case ">":
      return NumberFilterNumericComparison.GreaterThan;
    case ">=":
      return NumberFilterNumericComparison.GreaterEqual;
    case "<":
      return NumberFilterNumericComparison.LessThan;
    case "<=":
      return NumberFilterNumericComparison.LessEqual;
    default:
      return NumberFilterNumericComparison.Equal;
  }
}

function enumToCompSymbol(enumVal: NumberFilterNumericComparison) {
  switch (enumVal) {
    case NumberFilterNumericComparison.GreaterThan:
      return ">";
    case NumberFilterNumericComparison.GreaterEqual:
      return ">=";
    case NumberFilterNumericComparison.LessThan:
      return "<";
    case NumberFilterNumericComparison.LessEqual:
      return "<=";
    default:
      return;
  }
}

const DATE_SPAN_SEP = "<>";

export function activeValueToParamValues(activeValue: FilterValue): string[] {
  switch (activeValue.type) {
    case "Number":
      const nullInclusion = activeValue.comparison.nullInclusion;
      const comparisonType = activeValue.comparison.type;
      if (nullInclusion === NumberFilterNullInclusion.OnlyNull) {
        return ["NULL"];
      }
      const nullParam =
        nullInclusion === NumberFilterNullInclusion.IncludeNull ? ["NULL"] : [];
      if (comparisonType === NumberFilterComparisonMode.Value) {
        const value = activeValue.comparison.value;
        const compSymbol =
          enumToCompSymbol(activeValue.comparison.numericComparison) ?? "";
        return [...nullParam, `${compSymbol}${value}`];
      }
      if (comparisonType === NumberFilterComparisonMode.Range) {
        return [
          ...nullParam,
          `${activeValue.comparison.minValueInclusive}:${activeValue.comparison.maxValueInclusive}`,
        ];
      }
      return [];
    case "EnumSingle":
    case "Date":
    case "Year":
      return [activeValue.selectedValue];
    case "DateComparison":
      return [activeValue.value, activeValue.operator];
    case "Enum":
      return activeValue.selectedValues;
    case "DateSpan":
      return [
        [activeValue.startDate ?? "", activeValue.endDate ?? ""].join(
          DATE_SPAN_SEP,
        ),
      ];
    case "Text":
      return [activeValue.value];
  }
}

export function paramValuesToActiveValue(
  def: FilterDefinition,
  values: string[],
): FilterValue | undefined {
  switch (def.type) {
    case "Number":
      const includeNull = values.find((t) => t === "NULL");
      const nullInclusion = includeNull
        ? values.length === 1
          ? NumberFilterNullInclusion.OnlyNull
          : NumberFilterNullInclusion.IncludeNull
        : NumberFilterNullInclusion.ExcludeNull;
      if (nullInclusion === NumberFilterNullInclusion.OnlyNull) {
        return {
          type: def.type,
          key: def.key,
          comparison: {
            type: NumberFilterComparisonMode.Null,
            nullInclusion,
          },
        };
      }
      const pureNumber = values.find((t) =>
        /^((<=)|(>=)|<|>)?-?\d+\.?\d*$/.exec(t),
      );
      if (pureNumber) {
        const comparisonSymbol = /^((<=)|(>=)|<|>)/.exec(pureNumber)?.at(0);
        const numericComparison = compSymbolToEnum(comparisonSymbol);
        const value = parseFloat(
          comparisonSymbol
            ? pureNumber.slice(comparisonSymbol.length)
            : pureNumber,
        );
        return {
          type: def.type,
          key: def.key,
          comparison: {
            type: NumberFilterComparisonMode.Value,
            nullInclusion,
            numericComparison,
            value,
          },
        };
      }
      const range = values.find((t) => /^-?\d+.?\d*:-?\d+.?\d*$/.exec(t));
      if (range) {
        const [minValueInclusive, maxValueInclusive] = range
          .split(":")
          .map((t) => parseFloat(t));
        if (
          minValueInclusive === undefined ||
          maxValueInclusive === undefined
        ) {
          return;
        }
        return {
          type: def.type,
          key: def.key,
          comparison: {
            type: NumberFilterComparisonMode.Range,
            nullInclusion,
            minValueInclusive,
            maxValueInclusive,
          },
        };
      }
      return;
    case "Date":
    case "EnumSingle":
    case "Year":
      return values[0]
        ? {
            type: def.type,
            key: def.key,
            selectedValue: values[0],
          }
        : undefined;
    case "DateComparison":
      return values[0] && values[1]
        ? {
            ...defaultDraftValueDateComparisonFilter(def.key),
            value: values[0],
            operator: values[1] as DateComparisonOperator,
          }
        : undefined;
    case "Enum":
      return values.length > 0
        ? {
            type: def.type,
            key: def.key,
            selectedValues: values,
          }
        : undefined;
    case "DateSpan":
      if (values.length > 0 && values[0]) {
        const dates = values[0].split(DATE_SPAN_SEP);
        return {
          type: def.type,
          key: def.key,
          startDate: mapOptionalString(dates[0]),
          endDate: mapOptionalString(dates[1]),
        };
      }
    default:
      return undefined;
  }
}

export function useSearchParamStateProvider(
  filterDefinitions: FilterDefinition[],
  useRouterReplace = false,
): FilterSettingsStateProvider {
  const [filterSettingsVisible, setFilterSettingsVisible] = useSearchParam(
    "filtersOpen",
    "boolean",
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeValues = filterDefinitions
    .map((def) => [def, searchParams.getAll(def.key).filter((t) => t)] as const)
    .map(([def, values]) => paramValuesToActiveValue(def, values))
    .filter((t) => t !== undefined);

  const setActiveValues = useCallback(
    (newActiveValues: FilterValue[]) => {
      const newSearchParams = newActiveValues.reduce(
        (
          currentSearchParams: URLSearchParams | ReadonlyURLSearchParams,
          activeValue,
        ): URLSearchParams => {
          const stringValues = activeValueToParamValues(activeValue);
          return updateSearchParam(
            activeValue.key,
            stringValues,
            currentSearchParams,
          );
        },
        searchParams,
      );

      const removedValues = activeValues.filter(
        (t) => !newActiveValues.some((k) => k.key === t.key),
      );
      const newAndRemovedSearchParams = removedValues.reduce(
        (currentSearchParams, removedValue) =>
          updateSearchParam(removedValue.key, [], currentSearchParams),
        newSearchParams,
      );

      if (useRouterReplace) {
        const paramsString = newAndRemovedSearchParams.toString();
        const query = paramsString && `?${paramsString}`;
        router.replace(`${pathname}${query}`);
      } else {
        setWindowSearchParams(pathname, newAndRemovedSearchParams, false);
      }
    },
    [searchParams, activeValues, useRouterReplace, router, pathname],
  );

  const [errorMessages, setErrorMessages] = useState([] as string[]);

  return {
    filterSettingsVisible,
    setFilterSettingsVisible: (a: SetStateAction<boolean>) => {
      const next = typeof a === "function" ? a(filterSettingsVisible) : a;
      setFilterSettingsVisible(next);
    },
    activeValues,
    setActiveValues,
    errorMessages,
    setErrorMessages,
  };
}
