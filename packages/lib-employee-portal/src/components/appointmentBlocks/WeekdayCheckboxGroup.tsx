/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { SxProps } from "@mui/joy/styles/types";

import { CheckboxGroupField, validatePipe } from "@eshg/lib-portal";

import {
  WEEKDAY_TYPES,
  WeekdayCheckboxOption,
} from "./AppointmentBlockFormWithDays";

interface CheckboxGroupProps {
  name: string;
  options: WeekdayCheckboxOption[];
  label: string;
  sx?: SxProps;
  onChange?: (options: WeekdayCheckboxOption[]) => void;
  required?: boolean;
  validate?: (value: string[] | undefined) => string | undefined;
}

function requiredValidation(options: string[] = []) {
  if (!options.length) {
    return "Bitte mindestens einen Tag auswählen.";
  } else {
    return undefined;
  }
}

export function WeekdayCheckboxGroup({
  options,
  label,
  required,
  ...props
}: Readonly<CheckboxGroupProps>) {
  return (
    <CheckboxGroupField
      label={required ? `${label} *` : label}
      validate={validatePipe(
        required ? requiredValidation : undefined,
        props.validate,
      )}
      name={props.name}
      options={options.map((option) => ({
        label: option.label,
        value: option.id,
        ariaLabel: WEEKDAY_TYPES[option.id],
      }))}
      size="sm"
    />
  );
}
