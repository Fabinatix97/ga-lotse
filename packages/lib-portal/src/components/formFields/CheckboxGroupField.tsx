/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlProps,
} from "@mui/joy";
import { SxProps, TypographySystem } from "@mui/joy/styles/types";
import { ChangeEvent, ChangeEventHandler, ReactNode, useId } from "react";

import { ValidationRules } from "../../types/form";
import { Row } from "../Row";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { useBaseField } from "./BaseField";
import { FieldSetControl } from "./FieldSetControl";
import { SelectOption } from "./SelectOptions";

interface AccessibleSelectOption extends SelectOption {
  ariaLabel?: string;
}

interface CheckboxGroupFieldProps<T extends SelectOption>
  extends ValidationRules<T["value"][]> {
  options: T[];
  name: string;
  label?: string | ReactNode;
  labelLevel?: keyof TypographySystem;
  orientation?: "vertical" | "horizontal";
  onChange?: ChangeEventHandler<HTMLInputElement>;
  sx?: SxProps;
  sxCheckboxes?: SxProps;
  // Retains the styling of the radio buttons but prevents onChange from being called
  readOnly?: boolean;
  // Disables the checkboxes
  disabled?: boolean;
  children?: ReactNode;
  size?: CheckboxProps["size"];
  groupHelperTextId?: string;
}

export function CheckboxGroupField<T extends SelectOption = SelectOption>(
  props: CheckboxGroupFieldProps<T>,
) {
  const field = useBaseField<T["value"][]>(props);
  const isFormDisabled = useIsFormDisabled();
  const groupHelperTextId = useId();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (props.readOnly) {
      return;
    }
    const selected = props.options.find((k) => k.value === event.target.value);
    if (!selected) {
      return;
    }
    const oldValues = field.input.value ?? [];
    const newValues = oldValues.includes(selected.value)
      ? field.input.value.filter((t) => t !== selected.value)
      : [...oldValues, selected.value];
    await field.helpers.setValue(newValues ?? []);
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <FieldSetControl
      legend={props.label}
      legendLevel={props.labelLevel}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      groupHelperTextId={groupHelperTextId}
      sx={props.sx}
      onBlur={field.input.onBlur}
    >
      <Checkboxes
        orientation={props.orientation}
        options={props.options}
        selected={field.input.value}
        name={props.name}
        error={field.error}
        disabled={isFormDisabled || props.disabled}
        readOnly={props.readOnly}
        size={props.size}
        groupHelperTextId={field.helperText ? groupHelperTextId : undefined}
        sx={props.sxCheckboxes}
        onChange={handleChange}
      />
      {props.children}
    </FieldSetControl>
  );
}

export type FieldSetProps = Pick<
  FormControlProps,
  | "required"
  | "error"
  | "sx"
  | "disabled"
  | "className"
  | "onBlur"
  | "aria-label"
> & { flexDirection?: "row" | "column" };

export interface FieldSetLegendAndHelper {
  helperText?: string;
  legend?: string | ReactNode;
  legendLevel?: keyof TypographySystem;
  children: ReactNode;
  groupHelperTextId?: string;
}

interface CheckboxesProps<T extends AccessibleSelectOption> {
  name: string;
  options: T[];
  selected: T["value"][];
  disabled?: boolean;
  readOnly?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  size: CheckboxProps["size"];
  error: boolean;
  orientation?: "vertical" | "horizontal";
  groupHelperTextId?: string;
  sx?: SxProps;
}

function Checkboxes<T extends AccessibleSelectOption>({
  name,
  options,
  selected,
  disabled,
  readOnly,
  onChange,
  size,
  orientation,
  error,
  groupHelperTextId,
  sx,
}: CheckboxesProps<T>) {
  return (
    <Row
      sx={{
        flexDirection: orientation === "vertical" ? "column" : "row",
        marginY: 1,
        columnGap: 3,
        rowGap: 2,
        ...sx,
      }}
    >
      {options.map((t) => (
        <FormControl key={name + t.value} error={error}>
          <Checkbox
            checked={selected?.includes(t.value) ?? false}
            value={t.value}
            label={t.label}
            disabled={disabled}
            readOnly={readOnly}
            size={size}
            slotProps={{
              input: {
                "aria-describedby": groupHelperTextId,
                "aria-label": t.ariaLabel,
              },
            }}
            onChange={onChange}
          />
        </FormControl>
      ))}
    </Row>
  );
}
