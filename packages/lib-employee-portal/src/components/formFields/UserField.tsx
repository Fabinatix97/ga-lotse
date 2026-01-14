/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Close } from "@mui/icons-material";
import { Chip, ChipProps, Stack, Tooltip } from "@mui/joy";
import { useId } from "react";
import { isDefined } from "remeda";

import {
  BaseField,
  CustomAutocomplete,
  FieldProps,
  LiveAnnouncer,
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
  label: string;
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
    label?: string;
  } {
    if (props.freeStaff.includes(item.userId)) {
      return {
        title: "Es gibt keine Konflikte.",
        color: "success",
        label: "verfügbar",
      };
    } else if (props.blockedStaff.includes(item.userId)) {
      return {
        title: "Es gibt mindestens einen Terminkonflikt.",
        color: "danger",
        label: "belegt",
      };
    } else {
      return {
        title: "Es wurde noch nicht auf Personalverfügbarkeit geprüft.",
        color: "neutral",
      };
    }
  }

  const optionsByUserId = Object.fromEntries(
    props.options.map((o) => [o.userId, o]),
  );
  const unknownUser = { firstName: "Unbekannter", lastName: "Benutzer" };

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
        value={field.input.value.map(
          (userId) => optionsByUserId[userId] ?? { ...unknownUser, userId },
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
        renderTags={(options, getTagProps) => (
          <Stack direction="column">
            {options.map((item, index) => (
              <Tooltip
                key={index}
                id={tooltipId}
                title={getAvailability(item).title}
              >
                <Chip
                  variant="soft"
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
                  <Stack direction="row" gap={1}>
                    {formatUserName(item)}
                    {isDefined(getAvailability(item).label) && (
                      <Chip color={getAvailability(item).color}>
                        {getAvailability(item).label}
                      </Chip>
                    )}
                  </Stack>
                </Chip>
              </Tooltip>
            ))}
          </Stack>
        )}
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
      <LiveAnnouncer
        active={props.blockedStaff.length > 0}
        message={`${props.label}: Es gibt mindestens einen Terminkonflikt`}
      />
      <LiveAnnouncer
        active={props.blockedStaff.length === 0 && props.freeStaff.length > 0}
        message={`${props.label}: Es gibt keine Terminkonflikte`}
      />
    </BaseField>
  );
}
