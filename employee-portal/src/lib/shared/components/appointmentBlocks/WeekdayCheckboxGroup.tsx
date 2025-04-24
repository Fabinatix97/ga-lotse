/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { CheckboxGroupField } from "@eshg/lib-portal/components/formFields/CheckboxGroupField";
import { SxProps } from "@mui/joy/styles/types";

import {
  WEEKDAY_TYPES,
  WeekdayCheckboxOption,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";

export interface CheckboxGroupProps {
  name: string;
  options: WeekdayCheckboxOption[];
  label: string;
  sx?: SxProps;
  onChange?: (options: WeekdayCheckboxOption[]) => void;
  required?: boolean;
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
      validate={required ? requiredValidation : undefined}
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
