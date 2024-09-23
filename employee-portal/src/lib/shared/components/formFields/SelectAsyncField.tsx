/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { CircularProgress, Option, Select } from "@mui/joy";
import { useState } from "react";

export interface OptionValue {
  value: string;
  label: string;
}

interface SelectAsyncProps extends FieldProps<string> {
  fetchOptions: () => Promise<OptionValue[]>;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

// maybe join this with <SelectField> or <AutocompleteField> later
export function SelectAsyncField(props: SelectAsyncProps) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<OptionValue[]>([]);
  const field = useBaseField<string>(props);

  async function onListboxOpenChange(isOpen: boolean) {
    if (isOpen && options.length === 0) {
      setLoading(true);
      const options = await props.fetchOptions();
      setOptions(options);
      setLoading(false);
    }
  }

  return (
    <BaseField
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
    >
      <Select<string>
        name={props.name}
        value={field.input.value}
        onChange={(_, value) => {
          void field.helpers.setValue(value ?? "");
          props.onChange?.(value);
        }}
        onBlur={field.input.onBlur}
        onListboxOpenChange={onListboxOpenChange}
        placeholder={props.placeholder}
        disabled={props.disabled}
        endDecorator={
          loading ? (
            <CircularProgress aria-label={`Lade ${props.name}`} size="sm" />
          ) : null
        }
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value} label={option.label}>
            {option.label}
          </Option>
        ))}
      </Select>
    </BaseField>
  );
}
