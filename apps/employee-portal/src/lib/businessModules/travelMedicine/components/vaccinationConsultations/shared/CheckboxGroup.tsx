/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  Checkbox,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent } from "react";

import { useBaseField } from "@eshg/lib-portal";
import {
  ApiAppliedService,
  ApiAssignableService,
} from "@eshg/travel-medicine-api";

import { theme } from "@/lib/baseModule/theme/theme";

export enum Mode {
  assignableService,
  appliedService,
}

const StyledFieldSet = styled("fieldset")({
  border: 0,
  margin: 0,
  padding: 0,
});

const StyledLegend = styled("legend")({
  fontWeight: theme.fontWeight.lg,
  fontSize: theme.fontSize.md,
  size: "md",
  color: theme.palette.text.primary,
  padding: 0,
  marginBottom: 16,
});

interface CheckboxGroupProps {
  mode: Mode;
  name: string;
  element: ApiAssignableService[] | ApiAppliedService[];
  label: string;
  sx?: SxProps;
  onChange?: (values: ApiAssignableService[] | ApiAppliedService[]) => void;
}

export function CheckboxGroup({
  element,
  label,
  ...props
}: Readonly<CheckboxGroupProps>) {
  const { input, meta, helpers, helperText } = useBaseField<
    ApiAssignableService[] | ApiAppliedService[]
  >({
    validate: (value: ApiAssignableService[] | ApiAppliedService[]) => {
      if (value.length <= 0) {
        return "Bitte mindestens eine Auswahl treffen";
      } else {
        return undefined;
      }
    },
    ...props,
  });

  async function handleCheckboxChange(
    event: ChangeEvent<HTMLInputElement>,
    value: ApiAssignableService | ApiAppliedService,
  ) {
    const checked = event.target.checked;
    let newArray: (ApiAssignableService | ApiAppliedService)[] = [];
    if (
      checked &&
      !input.value.find((service) => service.serviceId === value.serviceId)
    ) {
      newArray = input.value.length <= 0 ? [value] : [...input.value, value];

      await helpers.setValue(newArray);
    } else if (!checked) {
      newArray = input.value.filter((a) => a.serviceId !== value.serviceId);
      await helpers.setValue(newArray);
    }
    props.onChange?.(newArray);
    event.stopPropagation();
  }

  const labelId = input.name;
  const ariaLabelId = `${labelId}-label`;

  return (
    <StyledFieldSet>
      <StyledLegend id={ariaLabelId}>{label}</StyledLegend>

      <List size="sm" sx={{ rowGap: 2, py: 0 }} aria-labelledby={ariaLabelId}>
        {props.mode === Mode.assignableService
          ? (element as ApiAssignableService[])?.map((val, index) => (
              <ListItem
                key={index}
                sx={{
                  "--ListItem-paddingY": 0,
                  "--ListItem-minHeight": "1rem",
                  "--ListItem-paddingLeft": 0,
                }}
              >
                <Checkbox
                  name={`serviceChecks[${index}]`}
                  label={`${val.serviceDescription}${val.vaccinationNumber ? ` - Nr. ${val.vaccinationNumber}` : ""}${val.vaccinationNumber && val.vaccinationNumber > 1 ? ` (+ ${val.latency} Woche/n)` : ""}`}
                  checked={
                    input.value.find(
                      (service) => service.serviceId === val.serviceId,
                    ) !== undefined
                  }
                  onChange={(e) => handleCheckboxChange(e, val)}
                />
              </ListItem>
            ))
          : (element as ApiAppliedService[])?.map((val, index) => (
              <ListItem
                key={index}
                sx={{
                  "--ListItem-paddingY": 0,
                  "--ListItem-minHeight": "1rem",
                  "--ListItem-paddingLeft": 0,
                }}
              >
                <Checkbox
                  name={`appliedServices[${index}]`}
                  label={val.serviceDescription}
                  checked={
                    input.value.find(
                      (service) => service.serviceId === val.serviceId,
                    ) !== undefined
                  }
                  onChange={(e) => handleCheckboxChange(e, val)}
                />
              </ListItem>
            ))}
        {}
      </List>
      <FormControl error={!!meta.error}>
        <FormHelperText sx={{ pt: 1 }}>{helperText}</FormHelperText>
      </FormControl>
    </StyledFieldSet>
  );
}
