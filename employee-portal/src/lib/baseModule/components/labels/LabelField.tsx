/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-base-to-string */
import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { CustomAutocomplete } from "@eshg/lib-portal/components/inputs/CustomAutocomplete";
import { FieldProps } from "@eshg/lib-portal/types/form";
import Close from "@mui/icons-material/Close";
import { AutocompleteProps, Chip } from "@mui/joy";
import { isString } from "remeda";

type JoyUiSelectValue = AutocompleteProps<
  string,
  true,
  boolean,
  false
>["value"];
type SelectFieldValue = NonNullable<JoyUiSelectValue>;

interface LabelFieldProps extends FieldProps<SelectFieldValue> {
  options: string[];
  placeholder?: string;
}

export function LabelField(props: LabelFieldProps) {
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
      <CustomAutocomplete
        freeSolo
        multiple
        clearOnBlur
        selectOnFocus
        filterSelectedOptions
        name={props.name}
        value={field.input.value}
        disableClearable={field.required}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          const filtered = options.filter(
            (opt) =>
              opt.value.includes(inputValue) &&
              !field.input.value.includes(opt.value),
          );
          const isExisting = options.some(
            (option) => inputValue === option.value,
          );
          if (inputValue !== "" && !isExisting) {
            filtered.push({
              value: inputValue,
              label: `Neues Label „${inputValue}”`,
            });
          }
          return filtered;
        }}
        onBlur={field.input.onBlur}
        placeholder={props.placeholder}
        options={props.options.map((label) => ({ value: label, label }))}
        getOptionLabel={(value) => (isString(value) ? value : value.label)}
        renderTags={(tags, getTagProps) =>
          tags.map((item, index) => (
            <Chip
              variant={"soft"}
              color={"primary"}
              size={"sm"}
              endDecorator={<Close fontSize="sm" />}
              sx={{ minWidth: 0 }}
              {...getTagProps({ index })}
              key={String(item)}
            >
              {String(item)}
            </Chip>
          ))
        }
        slotProps={{
          listbox: {
            disablePortal: true,
          },
        }}
      />
    </BaseField>
  );
}
