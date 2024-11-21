/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { ValidationRules } from "@eshg/lib-portal/types/form";
import { Radio, RadioGroup, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, ChangeEventHandler, ReactNode } from "react";

interface RadioButtonsFieldProps<T extends SelectOption>
  extends ValidationRules<T["value"]> {
  options: T[];
  name: string;
  label?: string | ReactNode;
  direction?: "column" | "row";
  onChange?: ChangeEventHandler<HTMLInputElement>;
  sx?: SxProps;
  // Retains the styling of the radio buttons but prevents onChange from being called
  readOnly?: boolean;
  // Disables the radio buttons
  disabled?: boolean;
  "data-testid"?: string;
}

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  columnGap: theme.spacing(2),
  rowGap: theme.spacing(1),
}));

export function RadioButtonsField<T extends SelectOption = SelectOption>(
  props: RadioButtonsFieldProps<T>,
) {
  const field = useBaseField<T["value"]>(props);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    if (props.readOnly) {
      return;
    }
    const selected = props.options.find((k) => k.value === event.target.value);
    await field.helpers.setValue(selected?.value ?? "");
    if (props.onChange) {
      props.onChange(event);
    }
  }

  return (
    <BaseField
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      sx={props.sx}
    >
      <StyledRadioGroup
        name={props.name}
        data-testid={props["data-testid"]}
        value={field.input.value ? String(field.input.value) : ""}
        onChange={onChange}
        onBlur={field.input.onBlur}
        style={{
          flexDirection: props.direction ?? "row",
        }}
        sx={{
          gap: 2,
        }}
      >
        <RadioButtons
          options={props.options}
          selected={String(field.input.value)}
          name={props.name}
          disabled={props.disabled}
          readOnly={props.readOnly}
        />
      </StyledRadioGroup>
    </BaseField>
  );
}

interface RadioButtonsProps<T extends SelectOption> {
  name: string;
  options: T[];
  selected: T["value"];
  disabled?: boolean;
  readOnly?: boolean;
}

function RadioButtons<T extends SelectOption>({
  name,
  options,
  selected,
  disabled,
  readOnly,
}: RadioButtonsProps<T>) {
  return (
    <>
      {options.map((t) => (
        <Radio
          key={name + t.value}
          checked={selected === t.value}
          value={t.value}
          label={t.label}
          disabled={disabled}
          readOnly={readOnly}
        />
      ))}
    </>
  );
}
