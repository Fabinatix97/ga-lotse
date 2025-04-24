/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input } from "@mui/joy";

import {
  DateFilterDefinition,
  DateFilterValue,
} from "@/features/filters/types/DateFilter";

interface DateFilterProps {
  definition: DateFilterDefinition;
  value: DateFilterValue | null;
  onChange: (value: DateFilterValue | null) => void;
}

export function DateFilter(props: DateFilterProps) {
  function handleChange(optionValue: string | null) {
    props.onChange(
      optionValue
        ? {
            type: "Date",
            key: props.definition.key,
            selectedValue: optionValue,
          }
        : null,
    );
  }
  return (
    <Input
      type="date"
      value={props.value?.selectedValue ?? ""}
      onChange={(event) => handleChange(event.target.value)}
      sx={{ width: "100%" }}
    />
  );
}
