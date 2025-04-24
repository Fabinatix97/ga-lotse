/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { RadioGroupFieldProps } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { Validator } from "@eshg/lib-portal/types/form";
import { FormControl, FormHelperText, FormLabel, RadioGroup } from "@mui/joy";
import { FieldHelperProps } from "formik";
import { ChangeEvent, memo } from "react";
import { isDefined } from "remeda";

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
        onChange={handleChange}
        orientation={props.orientation}
      >
        {props.children}
      </RadioGroup>
      {fieldError && <FormHelperText>{props.required}</FormHelperText>}
    </FormControl>
  );
}
