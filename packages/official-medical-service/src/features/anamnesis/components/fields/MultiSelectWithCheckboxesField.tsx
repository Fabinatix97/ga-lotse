/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { ReactNode, memo } from "react";

import {
  SelectField,
  SelectFieldProps,
  SelectFieldValue,
  useBaseField,
} from "@eshg/lib-portal";

export function MultiSelectWithCheckboxesField<
  TOptionLabel extends string | ReactNode = string,
>(props: Omit<SelectFieldProps<boolean, TOptionLabel>, "multiple">) {
  const { input } = useBaseField<SelectFieldValue<boolean>>(props);

  return (
    <MemoizedMultiSelectWithCheckboxesFieldProps
      fieldInputValue={input.value}
      {...props}
    />
  );
}

interface InnerMultiSelectWithCheckboxesFieldProps<
  TOptionLabel extends string | ReactNode = string,
> extends Omit<SelectFieldProps<boolean, TOptionLabel>, "multiple"> {
  fieldInputValue: SelectFieldValue<boolean>;
}
const MemoizedMultiSelectWithCheckboxesFieldProps = memo(
  InnerMultiSelectWithCheckboxesField,
) as typeof InnerMultiSelectWithCheckboxesField;

function InnerMultiSelectWithCheckboxesField<
  TOptionLabel extends string | ReactNode = string,
>({
  fieldInputValue,
  ...props
}: InnerMultiSelectWithCheckboxesFieldProps<TOptionLabel>) {
  const renderedOptions = props.options?.map((option) => {
    return {
      value: option.value,
      label: (
        <>
          {fieldInputValue.includes(option.value) ? (
            <CheckBox color="primary" />
          ) : (
            <CheckBoxOutlineBlank color="neutral" />
          )}
          {option.label}
        </>
      ),
    };
  });

  return (
    <SelectField
      options={renderedOptions}
      name={props.name}
      label={props.label}
      multiple
      required={props.required}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  );
}
