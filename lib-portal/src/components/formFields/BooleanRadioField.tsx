/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/joy";
import { useField } from "formik";
import { ReactNode } from "react";

export interface BooleanRadioGroupFieldProps {
  name: string;
  label?: ReactNode;
  orientation?: "horizontal" | "vertical";
  allowDeselection?: boolean;
  trueLabel?: ReactNode;
  falseLabel?: ReactNode;
}

export function BooleanRadioField({
  name,
  label,
  orientation = "horizontal",
  allowDeselection = false,
  trueLabel = "Ja",
  falseLabel = "Nein",
}: BooleanRadioGroupFieldProps) {
  const [field, _, helpers] = useField<boolean | null>(name);

  function handleDeselect(forValue: boolean) {
    return function () {
      if (allowDeselection && field.value === forValue) {
        void helpers.setValue(null);
      }
    };
  }

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup
        orientation={orientation}
        name={field.name}
        value={field.value}
        onChange={(event) =>
          void helpers.setValue(event.currentTarget.value === "true")
        }
      >
        <Radio value={true} label={trueLabel} onClick={handleDeselect(true)} />
        <Radio
          value={false}
          label={falseLabel}
          onClick={handleDeselect(false)}
        />
      </RadioGroup>
    </FormControl>
  );
}
