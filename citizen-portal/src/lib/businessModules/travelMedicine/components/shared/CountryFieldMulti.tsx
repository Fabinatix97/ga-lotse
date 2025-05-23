/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Close } from "@mui/icons-material";
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

import { useTranslateCountry } from "@/lib/i18n/useTranslateCountry";

type JoyUiSelectValue = AutocompleteProps<
  SelectionOption,
  true,
  boolean,
  true
>["value"];
type SelectFieldValue = NonNullable<JoyUiSelectValue>;

interface CountryFieldMultiProps extends FieldProps<SelectFieldValue> {
  placeholder?: string;
}

export interface SelectionOption {
  label: string;
  value: string;
}

export function CountryFieldMulti(props: CountryFieldMultiProps) {
  const field = useBaseField(props);
  const { countryOptions } = useTranslateCountry();
  const countries = countryOptions();
  const iconId = useId();

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
        multiple
        clearOnBlur
        selectOnFocus
        filterSelectedOptions
        name={props.name}
        disableClearable={field.required}
        value={field.input.value}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          return options.filter(
            (opt) =>
              (opt as SelectionOption).label
                .toLowerCase()
                .includes(inputValue.toLowerCase()) &&
              !field.input.value.includes((opt as SelectionOption).value),
          );
        }}
        placeholder={props.placeholder}
        options={countries}
        getOptionLabel={(value) => (isString(value) ? value : value.label)}
        getOptionKey={(value) => (isString(value) ? value : value.value)}
        renderTags={(options, getTagProps) =>
          options.map((item, index) => (
            <Chip
              variant="soft"
              color="primary"
              size="sm"
              endDecorator={
                <Close
                  id={iconId}
                  fontSize="xl"
                  aria-label="Auswahl entfernen"
                />
              }
              sx={{ minWidth: 0, fontWeight: 500 }}
              {...getTagProps({ index })}
              key={index}
              slotProps={{
                action: {
                  "aria-describedby": iconId,
                },
              }}
            >
              {countries.find((a) => a.value === item)!.label}
            </Chip>
          ))
        }
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
        onBlur={field.input.onBlur}
      />
    </BaseField>
  );
}
