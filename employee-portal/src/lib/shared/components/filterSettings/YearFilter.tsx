/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { YearInput } from "@eshg/lib-portal/components/inputs/YearInput";
import { isValid, parse } from "date-fns";

import {
  YearFilterDefinition,
  YearFilterValue,
} from "@/lib/shared/components/filterSettings/models/YearFilter";

export interface YearFilterProps {
  definition: YearFilterDefinition;
  value: YearFilterValue | null;
  onChange: (value: YearFilterValue | null) => void;
}

export function YearFilter(props: YearFilterProps) {
  function handleChange(optionValue: string) {
    props.onChange(
      optionValue
        ? {
            type: "Year",
            key: props.definition.key,
            selectedValue: optionValue,
          }
        : null,
    );
  }
  return (
    <YearInput
      value={props.value?.selectedValue ?? ""}
      onChange={(event) => handleChange(event.target.value)}
      style={{ width: "100%" }}
    />
  );
}

export function validateYear({ selectedValue }: YearFilterValue) {
  if (!selectedValue) {
    return undefined;
  }

  const yearDate = parse(selectedValue, "yyyy", new Date());
  if (!isValid(yearDate)) {
    return "Bitte geben Sie eine gültige Jahreszahl an.";
  }

  return undefined;
}
