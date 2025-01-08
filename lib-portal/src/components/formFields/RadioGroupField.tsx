/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormHelperText, FormLabel, RadioGroup } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, PropsWithChildren, ReactNode } from "react";
import { isDefined } from "remeda";

import { ValidationRules } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { useBaseField } from "./BaseField";

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

export function RadioGroupField({
  sx,
  orientation,
  label,
  children,
  ...props
}: RadioGroupFieldProps) {
  const isFormDisabled = useIsFormDisabled();
  const { input, error, required, helpers } = useBaseField<string>(props);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    await helpers.setValue(event.target.value);
    if (isDefined(props.onChange)) {
      props.onChange(event.target.value);
    }
  }

  return (
    <FormControl
      error={error}
      required={required}
      sx={sx}
      disabled={isFormDisabled}
      data-testid={props["data-testid"]}
    >
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        name={input.name}
        value={input.value}
        onChange={handleChange}
        orientation={orientation}
      >
        {children}
      </RadioGroup>
      {error && <FormHelperText>{props.required}</FormHelperText>}
    </FormControl>
  );
}
