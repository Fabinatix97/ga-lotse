/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, ToggleButtonGroup, Typography } from "@mui/joy";
import { useId } from "react";

import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { FieldProps, OptionalFieldValue } from "@eshg/lib-portal/types/form";

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
  const labelId = useId();
  const options = resolveOptions(props.options);
  const disabled = useIsFormDisabled();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={3}
    >
      <Typography id={labelId} level="body-md">
        {props.label}
      </Typography>
      <ToggleButtonGroup
        value={resolveButtonValue(field.input.value)}
        variant="soft"
        color="neutral"
        spacing={0.5}
        onChange={(_, newValue) =>
          void field.helpers.setValue((newValue ?? "") as TValue)
        }
        aria-labelledby={labelId}
        disabled={disabled}
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
