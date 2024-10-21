/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  List,
  ListItem,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { WeekdayCheckboxOption } from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

export interface CheckboxGroupProps {
  name: string;
  options: WeekdayCheckboxOption[];
  label: string;
  sx?: SxProps;
  onChange?: (options: WeekdayCheckboxOption[]) => void;
}

export function WeekdayCheckboxGroup({
  options,
  label,
  ...props
}: Readonly<CheckboxGroupProps>) {
  const { input, meta, helperText } = useBaseField<WeekdayCheckboxOption[]>({
    validate: (options: WeekdayCheckboxOption[] = []) => {
      if (!options.length) {
        return "Bitte mindestens einen Tag auswählen";
      } else {
        return undefined;
      }
    },
    ...props,
  });

  const labelId = input.name;
  const ariaLabelId = `${labelId}-label`;

  return (
    <>
      <FormLabel id={ariaLabelId} htmlFor={labelId}>
        <Typography level="body-sm" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
      </FormLabel>
      <div id={labelId} role="group" aria-labelledby={ariaLabelId}>
        <List
          size="sm"
          role="listbox"
          sx={{ flexDirection: "row", mt: 1, gap: 2 }}
        >
          {options?.map((option, index) => (
            <ListItem
              key={index}
              sx={{
                "--ListItem-paddingY": 0,
                "--ListItem-minHeight": "1rem",
                "--ListItem-paddingLeft": 0,
              }}
            >
              <CheckboxField
                name={props.name}
                representingValue={option.id}
                label={option.label}
                size="sm"
              />
            </ListItem>
          ))}
        </List>
        <FormControl error={!!meta.error}>
          <FormHelperText sx={{ pt: 1 }}>{helperText}</FormHelperText>
        </FormControl>
      </div>
    </>
  );
}
