/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Row } from "@eshg/lib-portal/components/Row";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { ValidationRules } from "@eshg/lib-portal/types/form";
import { Radio } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

import { RadioGroupField } from "./RadioGroupField";

interface RadioButtonsFieldProps<T extends SelectOption>
  extends ValidationRules<T["value"]> {
  options: T[];
  name: string;
  label?: string | ReactNode;
  orientation?: "vertical" | "horizontal";
  onChange?: (value: T["value"]) => unknown;
  sx?: SxProps;
  // Retains the styling of the radio buttons but prevents onChange from being called
  readOnly?: boolean;
  // Disables the radio buttons
  disabled?: boolean;
  "data-testid"?: string;
}

export function RadioButtonsField<T extends SelectOption = SelectOption>({
  onChange,
  ...props
}: RadioButtonsFieldProps<T>) {
  function handleChange(value: string) {
    if (props.readOnly) {
      return;
    }
    if (onChange) {
      onChange(value);
    }
  }

  return (
    <RadioGroupField {...props} onChange={handleChange}>
      <RadioButtons
        options={props.options}
        name={props.name}
        disabled={props.disabled}
        readOnly={props.readOnly}
        orientation={props.orientation}
      />
    </RadioGroupField>
  );
}

interface RadioButtonsProps<T extends SelectOption> {
  name: string;
  options: T[];
  disabled?: boolean;
  readOnly?: boolean;
  orientation?: "vertical" | "horizontal";
}

function RadioButtons<T extends SelectOption>({
  name,
  options,
  disabled,
  readOnly,
  orientation,
}: RadioButtonsProps<T>) {
  return (
    <Row flexDirection={orientation == "vertical" ? "column" : "row"}>
      {options.map((t) => (
        <Radio
          key={name + t.value}
          value={t.value}
          label={t.label}
          disabled={disabled}
          readOnly={readOnly}
        />
      ))}
    </Row>
  );
}
