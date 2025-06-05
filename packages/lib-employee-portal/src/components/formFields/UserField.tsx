/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Close } from "@mui/icons-material";
import { Chip, ChipProps, Tooltip } from "@mui/joy";
import { useId } from "react";

import {
  BaseField,
  CustomAutocomplete,
  FieldProps,
  formatUserName,
  useBaseField,
} from "@eshg/lib-portal";

export interface NamedUser {
  userId: string;
  firstName: string;
  lastName: string;
}

interface StaffUserFieldProps extends FieldProps<string[]> {
  options: NamedUser[];
  required?: string;
  placeholder?: string;
  blockedStaff: string[];
  freeStaff: string[];
}

export function UserField(props: Readonly<StaffUserFieldProps>) {
  const field = useBaseField(props);
  const iconId = useId();
  const labelId = useId();
  const tooltipId = useId();

  function setValue(newUserIds: string[]) {
    void field.helpers.setValue(newUserIds);
  }

  function getAvailability(item: NamedUser): {
    title: string;
    color: ChipProps["color"];
  } {
    if (props.freeStaff.includes(item.userId)) {
      return {
        title: "Es gibt keine Konflikte.",
        color: "success",
      };
    } else if (props.blockedStaff.includes(item.userId)) {
      return {
        title: "Es gibt mindestens einen Terminkonflikt.",
        color: "danger",
      };
    } else {
      return {
        title: "Es wurde noch nicht auf Personalverfügbarkeit geprüft.",
        color: "neutral",
      };
    }
  }

  return (
    <BaseField
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
    >
      <CustomAutocomplete
        multiple
        autoHighlight
        clearOnBlur
        selectOnFocus
        filterSelectedOptions
        name={props.name}
        value={props.options.filter((option) =>
          field.input.value.includes(option.userId),
        )}
        disableClearable={field.required}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          return options.filter((opt) => {
            const optionName = formatUserName(opt);
            const selectedUserIds = field.input.value;
            const matchesOption = optionName
              .toLowerCase()
              .includes(inputValue.toLowerCase());
            const matchesSelectedUser = selectedUserIds.some(
              (userId) => opt.userId === userId,
            );
            return matchesOption && !matchesSelectedUser;
          });
        }}
        placeholder={props.placeholder}
        options={props.options}
        getOptionLabel={(value) => formatUserName(value)}
        getOptionKey={(value) => value.userId}
        renderTags={(options, getTagProps) =>
          options.map((item, index) => (
            <Tooltip
              key={index}
              id={tooltipId}
              title={getAvailability(item).title}
            >
              <Chip
                variant="soft"
                color={getAvailability(item).color}
                size="sm"
                endDecorator={
                  <Close
                    id={iconId}
                    fontSize="sm"
                    aria-label="Auswahl entfernen"
                  />
                }
                sx={{ minWidth: 0 }}
                {...getTagProps({ index })}
                key={item.userId}
                slotProps={{
                  label: { id: labelId },
                  action: {
                    "aria-labelledby": `${labelId} ${iconId}`,
                    "aria-describedby": tooltipId,
                  },
                }}
              >
                {formatUserName(item)}
              </Chip>
            </Tooltip>
          ))
        }
        slotProps={{
          listbox: {
            disablePortal: true,
          },
        }}
        onChange={(_, newValue) => {
          setValue(newValue.map((user) => user.userId));
        }}
        onBlur={field.input.onBlur}
      />
    </BaseField>
  );
}
