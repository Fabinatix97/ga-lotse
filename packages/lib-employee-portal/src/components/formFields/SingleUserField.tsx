/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseField,
  CustomAutocomplete,
  FieldProps,
  formatUserName,
  useBaseField,
} from "@eshg/lib-portal";

import { NamedUser } from "./UserField";

interface SingleStaffUserFieldProps extends FieldProps<string> {
  options: NamedUser[];
  required?: string;
  placeholder?: string;
  label: string;
}

export function SingleUserField(props: Readonly<SingleStaffUserFieldProps>) {
  const field = useBaseField(props);

  const optionsByUserId = Object.fromEntries(
    props.options.map((o) => [o.userId, o]),
  );

  function mapValue(value: string) {
    return value
      ? (optionsByUserId[value] ?? {
          firstName: "Unbekannter",
          lastName: "Benutzer",
          userId: value,
        })
      : null;
  }

  return (
    <BaseField
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
    >
      <CustomAutocomplete
        multiple={false}
        autoHighlight
        clearOnBlur
        selectOnFocus
        filterSelectedOptions
        name={props.name}
        value={mapValue(field.input.value)}
        disableClearable={field.required}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          return options.filter((opt) => {
            const optionName = formatUserName(opt);
            const matchesOption = optionName
              .toLowerCase()
              .includes(inputValue.toLowerCase());
            const matchesSelectedUser = opt.userId === field.input.value;
            return matchesOption && !matchesSelectedUser;
          });
        }}
        placeholder={props.placeholder}
        options={props.options}
        getOptionLabel={(value) => formatUserName(value)}
        getOptionKey={(value) => value.userId}
        slotProps={{
          listbox: {
            disablePortal: true,
          },
        }}
        onChange={(_, newValue) => {
          void field.helpers.setValue(newValue !== null ? newValue.userId : "");
        }}
        onBlur={field.input.onBlur}
      />
    </BaseField>
  );
}
