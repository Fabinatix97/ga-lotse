/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isValid, parse } from "date-fns";

import { YearInput } from "@eshg/lib-portal/components/inputs/YearInput";

import { YearFilterDefinition, YearFilterValue } from "../../types/YearFilter";

interface YearFilterProps {
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
      sx={{ width: "100%" }}
      onChange={(event) => handleChange(event.target.value)}
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
