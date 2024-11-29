/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { FieldProps } from "@eshg/lib-portal/types/form";
import Close from "@mui/icons-material/Close";
import {
  Autocomplete,
  AutocompleteProps,
  Chip,
  ChipProps,
  Tooltip,
} from "@mui/joy";
import { isString } from "remeda";

import { SelectionOption } from "@/lib/shared/components/appointmentBlocks/AppointmentStaffSelection";

type JoyUiSelectValue = AutocompleteProps<
  SelectionOption,
  true,
  boolean,
  true
>["value"];
type SelectFieldValue = NonNullable<JoyUiSelectValue>;

interface AppointmentStaffFieldProps extends FieldProps<SelectFieldValue> {
  options: SelectionOption[];
  placeholder?: string;
  blockedStaff: string[];
  freeStaff: string[];
}

export function AppointmentStaffField(
  props: Readonly<AppointmentStaffFieldProps>,
) {
  const field = useBaseField(props);

  function setValue(newValue: (string | SelectOption)[]) {
    const labelNames = newValue.map((v) => (isString(v) ? v : v.value));
    void field.helpers.setValue(labelNames);
  }

  function getAvailability(item: SelectionOption): {
    title: string;
    color: ChipProps["color"];
  } {
    if (props.freeStaff.includes(item.value)) {
      return {
        title: "Es gibt keine Konflikte.",
        color: "success",
      };
    } else if (props.blockedStaff.includes(item.value)) {
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
        freeSolo
        clearOnBlur
        selectOnFocus
        filterSelectedOptions
        name={props.name}
        disableClearable={field.required}
        onChange={(_, newValue) => {
          setValue(newValue);
        }}
        filterOptions={(options, params) => {
          const { inputValue } = params;
          return options.filter(
            (opt) =>
              opt.label.toLowerCase().includes(inputValue.toLowerCase()) &&
              !field.input.value.includes(opt.label),
          );
        }}
        onBlur={field.input.onBlur}
        placeholder={props.placeholder}
        options={props.options}
        getOptionLabel={(value) => (isString(value) ? value : value.label)}
        getOptionKey={(value) => (isString(value) ? value : value.value)}
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
                key={item.value}
              >
                {item.label}
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
