/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { ReactNode, memo } from "react";

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import {
  SelectField,
  SelectFieldProps,
  SelectFieldValue,
} from "@eshg/lib-portal/components/formFields/SelectField";

export function MultiSelectWithCheckboxesField<
  TMultiple extends boolean = false,
  TOptionLabel extends string | ReactNode = string,
>(props: Omit<SelectFieldProps<TMultiple, TOptionLabel>, "multiple">) {
  const { input } = useBaseField<SelectFieldValue<TMultiple>>(props);

  return (
    <MemoizedMultiSelectWithCheckboxesFieldProps
      fieldInputValue={input.value}
      {...props}
    />
  );
}

interface InnerMultiSelectWithCheckboxesFieldProps<
  TMultiple extends boolean,
  TOptionLabel extends string | ReactNode = string,
> extends Omit<SelectFieldProps<TMultiple, TOptionLabel>, "multiple"> {
  fieldInputValue: SelectFieldValue<TMultiple>;
}
const MemoizedMultiSelectWithCheckboxesFieldProps = memo(
  InnerMultiSelectWithCheckboxesField,
) as typeof InnerMultiSelectWithCheckboxesField;

function InnerMultiSelectWithCheckboxesField<
  TMultiple extends boolean,
  TOptionLabel extends string | ReactNode = string,
>({
  fieldInputValue,
  ...props
}: InnerMultiSelectWithCheckboxesFieldProps<TMultiple, TOptionLabel>) {
  const renderedOptions = props.options.map((option) => {
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
      multiple={true}
      required={props.required}
      placeholder={props.placeholder}
    />
  );
}
