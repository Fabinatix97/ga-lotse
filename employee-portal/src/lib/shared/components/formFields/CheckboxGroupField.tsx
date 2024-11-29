/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Row } from "@eshg/lib-portal/components/Row";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { ValidationRules } from "@eshg/lib-portal/types/form";
import {
  Checkbox,
  FormControlProps,
  getFormControlUtilityClass,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, ChangeEventHandler, ReactNode } from "react";

import { Legend } from "./Legend";
import { OptionalHelperText } from "./OptionalHelperText";

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
}

export function CheckboxGroupField<T extends SelectOption = SelectOption>(
  props: CheckboxGroupFieldProps<T>,
) {
  const field = useBaseField<T["value"][]>(props);
  const isFormDisabled = useIsFormDisabled();

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
      flexDirection={props.orientation === "vertical" ? "column" : "row"}
      legend={props.label}
      helperText={field.helperText}
      required={field.required}
      sx={props.sx}
    >
      <Checkboxes
        onChange={handleChange}
        options={props.options}
        selected={field.input.value}
        name={props.name}
        disabled={isFormDisabled || props.disabled}
        readOnly={props.readOnly}
      />
      {props.children}
    </FieldSetControl>
  );
}

type FieldSetProps = Pick<
  FormControlProps,
  "required" | "error" | "sx" | "disabled" | "className" | "onBlur"
> & { flexDirection?: "row" | "column" };

interface FieldSetLegendAndHelper {
  helperText?: string;
  legend?: string | ReactNode;
  children: ReactNode;
}

export function FieldSetControl({
  helperText,
  legend,
  children,
  ...fieldSetProps
}: FieldSetProps & FieldSetLegendAndHelper) {
  const rootClass = getFormControlUtilityClass("root");
  const className =
    fieldSetProps.className != null
      ? `${rootClass} ${fieldSetProps.className}`
      : rootClass;
  return (
    <FieldSetRow component="fieldset" {...fieldSetProps} className={className}>
      <Legend>{legend}</Legend>
      {children}
      <OptionalHelperText>{helperText}</OptionalHelperText>
    </FieldSetRow>
  );
}

const FieldSetRow = styled(Row)(() => ({
  margin: 0,
  padding: 0,
  border: "none",
}));

interface CheckboxesProps<T extends SelectOption> {
  name: string;
  options: T[];
  selected: T["value"][];
  disabled?: boolean;
  readOnly?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function Checkboxes<T extends SelectOption>({
  name,
  options,
  selected,
  disabled,
  readOnly,
  onChange,
}: CheckboxesProps<T>) {
  return (
    <Row sx={{ marginTop: 1, marginBottom: 1 }}>
      {options.map((t) => (
        <Checkbox
          key={name + t.value}
          checked={selected?.includes(t.value) ?? false}
          value={t.value}
          label={t.label}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
        />
      ))}
    </Row>
  );
}
