/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input } from "@mui/joy";

import {
  TextFilterDefinition,
  TextFilterValue,
} from "@/features/filters/types/TextFilter";

interface TextFilterProps {
  definition: TextFilterDefinition;
  value: TextFilterValue | null;
  onChange: (value: TextFilterValue | null) => void;
}

export function TextFilter(props: TextFilterProps) {
  function handleChange(optionValue: string) {
    props.onChange(
      optionValue
        ? {
            type: "Text",
            key: props.definition.key,
            value: optionValue,
          }
        : null,
    );
  }

  return (
    <Input
      type="text"
      value={props.value?.value ?? ""}
      onChange={(event) => handleChange(event.target.value)}
      sx={{ width: "100%" }}
    />
  );
}
