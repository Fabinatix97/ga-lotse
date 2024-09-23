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
  element: WeekdayCheckboxOption[];
  label: string;
  sx?: SxProps;
  onChange?: (values: WeekdayCheckboxOption[]) => void;
}

export function WeekdayCheckboxGroup({
  element,
  label,
  ...props
}: Readonly<CheckboxGroupProps>) {
  const { input, meta, helperText } = useBaseField<WeekdayCheckboxOption[]>({
    validate: (value: WeekdayCheckboxOption[]) => {
      if (value.length <= 0) {
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
        <Typography level="body-md" sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
      </FormLabel>
      <div id={labelId} role="group" aria-labelledby={ariaLabelId}>
        <List
          size="sm"
          role="listbox"
          sx={{ flexDirection: "row", mt: 1, gap: 2 }}
        >
          {element?.map((val, index) => (
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
                representingValue={val.id}
                label={val.label}
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
