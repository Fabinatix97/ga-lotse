/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-base-to-string */
import Close from "@mui/icons-material/Close";
import { AutocompleteProps, Chip } from "@mui/joy";
import { useId } from "react";
import { isString } from "remeda";

import {
  BaseField,
  CustomAutocomplete,
  FieldProps,
  SelectOption,
  useBaseField,
} from "@eshg/lib-portal";

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
  const iconId = useId();
  const labelId = useId();
  const tooltipId = useId();

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
        placeholder={props.placeholder}
        options={props.options.map((label) => ({ value: label, label }))}
        getOptionLabel={(value) => (isString(value) ? value : value.label)}
        renderTags={(tags, getTagProps) =>
          tags.map((item, index) => (
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              endDecorator={
                <Close
                  id={iconId}
                  fontSize="sm"
                  aria-label="Auswahl entfernen"
                />
              }
              sx={{ minWidth: 0 }}
              {...getTagProps({ index })}
              key={String(item)}
              slotProps={{
                label: { id: labelId },
                action: {
                  "aria-labelledby": `${labelId} ${iconId}`,
                  "aria-describedby": tooltipId,
                },
              }}
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
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
        onBlur={field.input.onBlur}
      />
    </BaseField>
  );
}
