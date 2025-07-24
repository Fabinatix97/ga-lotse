/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, FormHelperText, FormLabel, RadioGroup } from "@mui/joy";
import { FieldHelperProps } from "formik";
import { ChangeEvent, memo } from "react";
import { isDefined } from "remeda";

import {
  RadioGroupFieldProps,
  Validator,
  useBaseField,
  useIsFormDisabled,
} from "@eshg/lib-portal";

export interface BooleanRadioGroupFieldProps
  extends Omit<RadioGroupFieldProps, "validate"> {
  validate?: Validator<boolean>;
}

export function BooleanRadioGroupField(props: BooleanRadioGroupFieldProps) {
  const { input, error, required, helpers } = useBaseField<boolean>(props);

  return (
    <MemoizedBooleanRadioGroupField
      fieldInputName={input.name}
      fieldInputValue={input.value}
      fieldError={error}
      fieldRequired={required}
      fieldHelpersSetValue={helpers.setValue}
      {...props}
    />
  );
}

interface InnerBooleanRadioGroupFieldProps extends BooleanRadioGroupFieldProps {
  fieldInputName: string;
  fieldInputValue: boolean;
  fieldError: boolean;
  fieldRequired: boolean;
  fieldHelpersSetValue: FieldHelperProps<boolean>["setValue"];
}
const MemoizedBooleanRadioGroupField = memo(InnerBooleanRadioGroupField);

function InnerBooleanRadioGroupField({
  fieldInputName,
  fieldInputValue,
  fieldError,
  fieldRequired,
  fieldHelpersSetValue,
  ...props
}: InnerBooleanRadioGroupFieldProps) {
  const isFormDisabled = useIsFormDisabled();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    await fieldHelpersSetValue(event.currentTarget.value === "true");
    if (isDefined(props.onChange)) {
      props.onChange(event.target.value);
    }
  }

  return (
    <FormControl
      error={fieldError}
      required={fieldRequired}
      sx={props.sx}
      disabled={isFormDisabled}
      data-testid={props["data-testid"]}
    >
      {props.label && <FormLabel>{props.label}</FormLabel>}
      <RadioGroup
        name={fieldInputName}
        value={fieldInputValue}
        orientation={props.orientation}
        tabIndex={-1}
        onChange={handleChange}
        onFocus={(el) => {
          // Transfer the focus to its first Radio input
          el.target.querySelector("input")?.focus();
        }}
      >
        {props.children}
      </RadioGroup>
      {fieldError && <FormHelperText>{props.required}</FormHelperText>}
    </FormControl>
  );
}
