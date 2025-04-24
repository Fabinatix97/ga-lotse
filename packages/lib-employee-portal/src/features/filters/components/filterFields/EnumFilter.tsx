/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Checkbox, CheckboxProps, Stack } from "@mui/joy";

import {
  EnumFilterDefinition,
  EnumFilterValue,
} from "@/features/filters/types/EnumFilter";

function EnumFilterCheckbox(
  props: Required<Pick<CheckboxProps, "label" | "checked" | "onChange">>,
) {
  return (
    <Checkbox
      color="primary"
      sx={{
        wordWrap: "break-word",
        hyphens: "auto",
      }}
      {...props}
    />
  );
}

interface EnumFilterProps {
  definition: EnumFilterDefinition;
  value: EnumFilterValue | null;
  onChange: (value: EnumFilterValue | null) => void;
}

export function EnumFilter(props: EnumFilterProps) {
  const selectedValues = props.value?.selectedValues ?? [];

  function handleChange(checked: boolean, optionValue: string) {
    const newSelectedValues = checked
      ? [...selectedValues, optionValue]
      : selectedValues.filter((value) => value !== optionValue);

    props.onChange(
      newSelectedValues.length > 0
        ? {
            type: "Enum",
            key: props.definition.key,
            selectedValues: newSelectedValues,
          }
        : null,
    );
  }

  return (
    <Stack gap={1}>
      {props.definition.options.map((option) => (
        <EnumFilterCheckbox
          key={option.value}
          label={option.label}
          checked={selectedValues.includes(option.value)}
          onChange={(event) => handleChange(event.target.checked, option.value)}
        />
      ))}
    </Stack>
  );
}
