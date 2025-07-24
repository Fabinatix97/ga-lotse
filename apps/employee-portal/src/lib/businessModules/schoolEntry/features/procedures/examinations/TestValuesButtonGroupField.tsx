/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Stack,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
  Typography,
} from "@mui/joy";
import { ReactNode, useId } from "react";

import {
  FieldProps,
  NullableFieldValue,
  OptionalFieldValue,
  SelectOption,
  isEmptyString,
  useBaseField,
  useIsFormDisabled,
} from "@eshg/lib-portal";

import { TestValueButton } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/TestValueButton";

function resolveButtonValue<TValue>(
  value: OptionalFieldValue<TValue>,
): TValue | null {
  return isEmptyString(value) ? null : value;
}

function resolveOptions<TValue extends string>(options: Option<TValue>[]) {
  return options.map((option) => {
    if (typeof option === "object") {
      return option;
    }

    return {
      label: option,
      value: option,
    };
  });
}

type Option<TValue extends string> = TValue | SelectOption<TValue>;

interface TestValuesButtonGroupFieldProps<TValue extends string>
  extends FieldProps<OptionalFieldValue<TValue>> {
  options: Option<TValue>[];
  buttonWidth: number;
}

export function TestValuesButtonGroupField<TValue extends string>(
  props: TestValuesButtonGroupFieldProps<TValue>,
) {
  const field = useBaseField<TValue>(props);
  const disabled = useIsFormDisabled();

  return (
    <TestValuesButtonGroup
      label={props.label}
      options={props.options}
      buttonWidth={props.buttonWidth}
      value={field.input.value}
      disabled={disabled}
      onChange={(newValue) =>
        void field.helpers.setValue((newValue ?? "") as TValue)
      }
    />
  );
}

interface TestValuesButtonGroup<TValue extends string> {
  label: ReactNode;
  options: Option<TValue>[];
  buttonWidth: number;
  disabled?: boolean;
  onChange: (value: NullableFieldValue<TValue>) => void;
  value?: OptionalFieldValue<TValue>;
  variant?: ToggleButtonGroupProps["variant"];
  color?: ToggleButtonGroupProps["color"];
}

export function TestValuesButtonGroup<TValue extends string>(
  props: TestValuesButtonGroup<TValue>,
) {
  const labelId = useId();
  const options = resolveOptions(props.options);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={3}
    >
      <Typography id={labelId} level="body-md" whiteSpace="nowrap">
        {props.label}
      </Typography>
      <ToggleButtonGroup
        value={resolveButtonValue(props.value)}
        variant={props.variant ?? "soft"}
        color={props.color ?? "neutral"}
        spacing={0.5}
        aria-labelledby={labelId}
        disabled={props.disabled}
        onChange={(_, newValue) =>
          props.onChange(newValue as NullableFieldValue<TValue>)
        }
      >
        {options.map((option) => (
          <TestValueButton
            key={option.value}
            value={option.value}
            buttonWidth={props.buttonWidth}
          >
            {option.label}
          </TestValueButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
