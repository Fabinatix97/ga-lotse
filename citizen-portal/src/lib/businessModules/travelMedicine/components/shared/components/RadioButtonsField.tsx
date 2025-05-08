/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, ChangeEventHandler, ReactNode } from "react";

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { ValidationRules } from "@eshg/lib-portal/types/form";

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
  props: Readonly<RadioButtonsFieldProps<T>>,
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
    <FormControl error={field.error} required={field.required} sx={props.sx}>
      <>
        {props.label && (
          <FormLabel htmlFor={field.input.name}>{props.label}</FormLabel>
        )}
        {field.error && <FormHelperText>{props.required}</FormHelperText>}
        <StyledRadioGroup
          name={props.name}
          value={field.input.value ? String(field.input.value) : ""}
          sx={{
            gap: 2,
            marginLeft: 2.5,
            marginBottom: 0,
            flexDirection: props.direction ?? "row",
          }}
          data-testid={props["data-testid"]}
          onChange={onChange}
          onBlur={field.input.onBlur}
        >
          <RadioButtons
            options={props.options}
            selected={String(field.input.value)}
            name={props.name}
            disabled={props.disabled}
            readOnly={props.readOnly}
          />
        </StyledRadioGroup>
      </>
    </FormControl>
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
}: Readonly<RadioButtonsProps<T>>) {
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
