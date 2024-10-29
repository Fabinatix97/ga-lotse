/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Option, Select } from "@mui/joy";
import { SyntheticEvent } from "react";

import {
  EnumSingleFilterDefinition,
  EnumSingleFilterValue,
} from "@/lib/shared/components/filterSettings/models/EnumSingleFilter";

export interface EnumSingleFilterProps {
  definition: EnumSingleFilterDefinition;
  value: EnumSingleFilterValue | null;
  onChange: (value: EnumSingleFilterValue | null) => void;
}

export function EnumSingleFilter(props: EnumSingleFilterProps) {
  function handleChange(
    event: SyntheticEvent | null,
    optionValue: string | null,
  ) {
    // I'm not certain why this handler sometimes fires with a null event
    if (event == null) {
      return;
    }
    props.onChange(
      optionValue
        ? {
            type: "EnumSingle",
            key: props.definition.key,
            selectedValue: optionValue,
          }
        : null,
    );
  }
  return (
    <Select
      placeholder={props.definition.placeholder}
      value={props.value?.selectedValue ?? null}
      onChange={handleChange}
      sx={{ width: "100%" }}
      aria-label={props.definition.name}
    >
      {props.definition.options.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
}
