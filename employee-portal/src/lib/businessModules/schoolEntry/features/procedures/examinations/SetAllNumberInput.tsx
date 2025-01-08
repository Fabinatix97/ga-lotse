/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import {
  BaseField,
  FieldComponentProps,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { Input } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useState } from "react";

interface SetAllNumberInput extends FieldComponentProps {
  label: string;
  sx?: SxProps;
  onChange: (selectedValue: number) => void;
  validate: (value: number) => string | undefined;
}

export function SetAllNumberInput(props: SetAllNumberInput) {
  const [value, setValue] = useState<number | string>("");
  const FieldComponent = props.component ?? BaseField;
  const disabled = useIsFormDisabled();

  return (
    <FieldComponent label={props.label} sx={props.sx}>
      <Input
        value={value}
        type="number"
        onChange={(event) => {
          const newValue = event.target.valueAsNumber;
          if (Number.isNaN(newValue) || props.validate(newValue)) {
            return;
          }
          setValue(newValue);
          props.onChange(newValue);
        }}
        onBlur={() => setValue("")}
        disabled={disabled}
      />
    </FieldComponent>
  );
}
