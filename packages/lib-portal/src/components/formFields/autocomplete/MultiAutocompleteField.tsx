/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chip, ChipDelete, Stack } from "@mui/joy";
import { SyntheticEvent, useId, useMemo } from "react";

import { CustomAutocomplete } from "../../inputs/CustomAutocomplete";
import { BaseField } from "../BaseField";

import { AutocompleteSelectOption } from "./AutocompleteSelectOptions";
import {
  CommonAutocompleteFieldProps,
  useAutocompleteFieldContext,
} from "./useAutocompleteFieldContext";

export type MultiAutocompleteFieldProps = CommonAutocompleteFieldProps<
  string[]
>;

export function MultiAutocompleteField(props: MultiAutocompleteFieldProps) {
  const { field, fieldProps, autocompleteProps } =
    useAutocompleteFieldContext(props);

  function handleChange(newValue: string[]) {
    void field.helpers.setValue(newValue);
    props.onChange?.(newValue);
  }

  function handleInputChange(
    event: SyntheticEvent,
    newValue: string,
    reason: string,
  ) {
    props.onInputChange?.(event, newValue, reason);
  }

  const optionMap = useMemo(
    () => new Map(props.options.map((opt) => [opt.value, opt])),
    [props.options],
  );

  function getOptionLabel(
    option: AutocompleteSelectOption["value"],
  ): AutocompleteSelectOption["label"] {
    return optionMap.get(option)!.label;
  }

  const id = useId();
  return (
    <BaseField {...fieldProps}>
      <CustomAutocomplete
        {...autocompleteProps}
        multiple
        freeSolo={false}
        value={field.input.value}
        options={props.options.map((opt) => opt.value)}
        renderTags={(values, getTagProps) => {
          return (
            <Stack direction="row" minWidth="0px" flexWrap="wrap" gap={0.5}>
              {values.map((value, index) => (
                <Chip
                  key={value}
                  id={`${id}-tag-${index}`}
                  sx={{ minWidth: 0 }}
                  endDecorator={
                    <ChipDelete
                      aria-label="Entfernen"
                      aria-describedby={`${id}-tag-${index}`}
                      {...getTagProps({ index })}
                    />
                  }
                >
                  {getOptionLabel(value)}
                </Chip>
              ))}
            </Stack>
          );
        }}
        onChange={(_, newValue) => {
          handleChange(newValue);
        }}
        onInputChange={handleInputChange}
      />
    </BaseField>
  );
}
