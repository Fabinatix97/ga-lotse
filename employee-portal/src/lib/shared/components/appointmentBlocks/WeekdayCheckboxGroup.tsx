/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { FormControl, FormHelperText, List, ListItem, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { theme } from "@/lib/baseModule/theme/theme";
import {
  WEEKDAY_TYPES,
  WeekdayCheckboxOption,
} from "@/lib/shared/components/appointmentBlocks/AppointmentBlockFormWithDays";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

const StyledFieldSet = styled("fieldset")({
  border: 0,
  margin: 0,
  padding: 0,
});

const StyledLegend = styled("legend")({
  fontWeight: theme.fontWeight.md,
  fontSize: theme.fontSize.sm,
  size: "md",
  color: theme.palette.text.primary,
  padding: 0,
  marginBottom: 6,
});

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
    <StyledFieldSet>
      <StyledLegend id={ariaLabelId}>{label}</StyledLegend>
      <List
        size="sm"
        orientation="horizontal"
        aria-labelledby={ariaLabelId}
        sx={{ padding: 0, gap: 2 }}
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
              aria-label={WEEKDAY_TYPES[option.id]}
            />
          </ListItem>
        ))}
      </List>
      <FormControl error={!!meta.error}>
        <FormHelperText sx={{ pt: 1 }}>{helperText}</FormHelperText>
      </FormControl>
    </StyledFieldSet>
  );
}
