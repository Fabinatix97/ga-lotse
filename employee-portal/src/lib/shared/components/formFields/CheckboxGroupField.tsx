/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Row } from "@eshg/lib-portal/components/Row";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { ValidationRules } from "@eshg/lib-portal/types/form";
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlProps,
  getFormControlUtilityClass,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, ChangeEventHandler, ReactNode, useId } from "react";

import { Legend } from "./Legend";
import { OptionalHelperText } from "./OptionalHelperText";

export interface AccessibleSelectOption extends SelectOption {
  ariaLabel?: string;
}
export interface CheckboxGroupFieldProps<T extends SelectOption>
  extends ValidationRules<T["value"][]> {
  options: T[];
  name: string;
  label?: string | ReactNode;
  orientation?: "vertical" | "horizontal";
  onChange?: ChangeEventHandler<HTMLInputElement>;
  sx?: SxProps;
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
      onBlur={field.input.onBlur}
      legend={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      groupHelperTextId={groupHelperTextId}
      sx={props.sx}
    >
      <Checkboxes
        orientation={props.orientation}
        onChange={handleChange}
        options={props.options}
        selected={field.input.value}
        name={props.name}
        error={field.error}
        disabled={isFormDisabled || props.disabled}
        readOnly={props.readOnly}
        size={props.size}
        groupHelperTextId={field.helperText ? groupHelperTextId : undefined}
      />
      {props.children}
    </FieldSetControl>
  );
}

type FieldSetProps = Pick<
  FormControlProps,
  | "required"
  | "error"
  | "sx"
  | "disabled"
  | "className"
  | "onBlur"
  | "aria-label"
> & { flexDirection?: "row" | "column" };

interface FieldSetLegendAndHelper {
  helperText?: string;
  legend?: string | ReactNode;
  children: ReactNode;
  groupHelperTextId?: string;
}

export function FieldSetControl({
  helperText,
  legend,
  children,
  error,
  groupHelperTextId,
  ...fieldSetProps
}: FieldSetProps & FieldSetLegendAndHelper) {
  const rootClass = getFormControlUtilityClass("root");
  const errorClass = getFormControlUtilityClass("error");
  const className =
    fieldSetProps.className != null
      ? `${rootClass} ${fieldSetProps.className}`
      : rootClass;

  const classNameWithError = error ? `${errorClass} ${className}` : className;
  return (
    <FieldSetRow
      component="fieldset"
      flexDirection={"column"}
      {...fieldSetProps}
      className={classNameWithError}
    >
      <Legend>{legend}</Legend>
      {children}
      <OptionalHelperText id={groupHelperTextId}>
        {helperText}
      </OptionalHelperText>
    </FieldSetRow>
  );
}

const FieldSetRow = styled(Row)(() => ({
  margin: 0,
  padding: 0,
  border: "none",
}));

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
}: CheckboxesProps<T>) {
  return (
    <Row
      sx={{
        flexDirection: orientation === "vertical" ? "column" : "row",
        marginY: 1,
        columnGap: 3,
        rowGap: 2,
      }}
    >
      {options.map((t) => (
        <FormControl error={error} key={name + t.value}>
          <Checkbox
            checked={selected?.includes(t.value) ?? false}
            value={t.value}
            label={t.label}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            size={size}
            slotProps={{
              input: {
                "aria-describedby": groupHelperTextId,
                "aria-label": t.ariaLabel,
              },
            }}
          />
        </FormControl>
      ))}
    </Row>
  );
}
