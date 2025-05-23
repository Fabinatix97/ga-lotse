/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormLabel, RadioGroup } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FieldHelperProps } from "formik";
import { ChangeEvent, PropsWithChildren, ReactNode, memo } from "react";
import { isDefined } from "remeda";

import { ValidationRules } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { renderHelperText, useBaseField } from "./BaseField";

export interface RadioGroupFieldProps
  extends ValidationRules<string>,
    PropsWithChildren {
  name: string;
  label?: string | ReactNode;
  sx?: SxProps;
  orientation?: "horizontal" | "vertical";
  onChange?: (newValue: string) => void;
  "data-testid"?: string;
}

export function RadioGroupField(props: RadioGroupFieldProps) {
  const { input, error, required, helpers } = useBaseField<string>(props);

  return (
    <MemoizedRadioGroupField
      fieldInputName={input.name}
      fieldInputValue={input.value}
      fieldRequired={required}
      fieldError={error}
      fieldHelpersSetValue={helpers.setValue}
      {...props}
    />
  );
}

interface InnerRadioGroupFieldProps extends RadioGroupFieldProps {
  fieldInputName: string;
  fieldInputValue: string;
  fieldError: boolean;
  fieldRequired: boolean;
  fieldHelpersSetValue: FieldHelperProps<string>["setValue"];
}

const MemoizedRadioGroupField = memo(InnerRadioGroupField);

function InnerRadioGroupField({
  fieldHelpersSetValue,
  fieldError,
  fieldInputValue,
  fieldInputName,
  fieldRequired,
  sx,
  orientation,
  label,
  children,
  ...props
}: InnerRadioGroupFieldProps) {
  const isFormDisabled = useIsFormDisabled();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    await fieldHelpersSetValue(event.target.value);
    if (isDefined(props.onChange)) {
      props.onChange(event.target.value);
    }
  }

  return (
    <FormControl
      error={fieldError}
      required={fieldRequired}
      sx={sx}
      disabled={isFormDisabled}
      data-testid={props["data-testid"]}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        name={fieldInputName}
        value={fieldInputValue}
        orientation={orientation}
        onChange={handleChange}
      >
        {children}
      </RadioGroup>
      {fieldError && renderHelperText(props.required)}
    </FormControl>
  );
}
