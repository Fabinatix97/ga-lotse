/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { Close } from "@mui/icons-material";
import { Autocomplete, AutocompleteProps, Chip } from "@mui/joy";
import { isString } from "remeda";

type JoyUiSelectValue = AutocompleteProps<
  SelectionOption,
  true,
  boolean,
  true
>["value"];
type SelectFieldValue = NonNullable<JoyUiSelectValue>;

interface CountryFieldMultiProps extends FieldProps<SelectFieldValue> {
  options: SelectOption[];
  placeholder?: string;
}

export interface SelectionOption {
  label: string;
  value: string;
}

export function CountryFieldMulti(props: CountryFieldMultiProps) {
  const field = useBaseField(props);

  function setValue(newValue: (string | SelectOption)[]) {
    const labelNames = newValue.map((v) => (isString(v) ? v : v.value));
    void field.helpers.setValue(labelNames);
  }

  return (
    <BaseField
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
    >
      <Autocomplete
        multiple
        clearOnBlur
        selectOnFocus
        filterSelectedOptions
        name={props.name}
        disableClearable={field.required}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          return options.filter(
            (opt) =>
              opt.label.toLowerCase().includes(inputValue.toLowerCase()) &&
              !field.input.value.includes(opt.label),
          );
        }}
        onBlur={field.input.onBlur}
        placeholder={props.placeholder}
        options={props.options}
        getOptionLabel={(value) => (isString(value) ? value : value.label)}
        getOptionKey={(value) => (isString(value) ? value : value.value)}
        renderTags={(options, getTagProps) =>
          options.map((item, index) => (
            <Chip
              variant={"soft"}
              color="primary"
              size={"sm"}
              endDecorator={<Close fontSize="xl" />}
              sx={{ minWidth: 0, fontWeight: 500 }}
              {...getTagProps({ index })}
              key={index}
            >
              {item.label}
            </Chip>
          ))
        }
      />
    </BaseField>
  );
}
