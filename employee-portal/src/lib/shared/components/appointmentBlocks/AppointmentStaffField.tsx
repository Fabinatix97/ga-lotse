/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { FieldProps } from "@eshg/lib-portal/types/form";
import Close from "@mui/icons-material/Close";
import { Autocomplete, Chip, ChipProps, Tooltip } from "@mui/joy";

import { fullName } from "@/lib/shared/components/users/userFormatter";

export interface StaffUser {
  userId: string;
  firstName: string;
  lastName: string;
}

interface AppointmentStaffFieldProps extends FieldProps<string[]> {
  options: StaffUser[];
  placeholder?: string;
  blockedStaff: string[];
  freeStaff: string[];
}

export function AppointmentStaffField(
  props: Readonly<AppointmentStaffFieldProps>,
) {
  const field = useBaseField(props);

  function setValue(newUserIds: string[]) {
    void field.helpers.setValue(newUserIds);
  }

  function getAvailability(item: StaffUser): {
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
      <Autocomplete
        multiple
        aria-description="Mehrfachauswahl möglich"
        autoHighlight
        clearOnBlur
        selectOnFocus
        filterSelectedOptions
        name={props.name}
        value={props.options.filter((option) =>
          field.input.value.includes(option.userId),
        )}
        disableClearable={field.required}
        onChange={(_, newValue) => {
          setValue(newValue.map((user) => user.userId));
        }}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          return options.filter((opt) => {
            const optionName = fullName(opt);
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
        onBlur={field.input.onBlur}
        placeholder={props.placeholder}
        options={props.options}
        getOptionLabel={(value) => fullName(value)}
        getOptionKey={(value) => value.userId}
        renderTags={(options, getTagProps) =>
          options.map((item, index) => (
            <Tooltip title={getAvailability(item).title} key={index}>
              <Chip
                variant={"soft"}
                color={getAvailability(item).color}
                size={"sm"}
                endDecorator={<Close fontSize="sm" />}
                sx={{ minWidth: 0 }}
                {...getTagProps({ index })}
                key={item.userId}
              >
                {fullName(item)}
              </Chip>
            </Tooltip>
          ))
        }
        slotProps={{
          listbox: {
            disablePortal: true,
          },
        }}
      />
    </BaseField>
  );
}
