/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/joy";
import { useField } from "formik";
import { ReactNode } from "react";

import { useTranslation } from "../../i18n/useTranslation";

export interface BooleanRadioGroupFieldProps {
  name: string;
  label?: ReactNode;
  orientation?: "horizontal" | "vertical";
  allowDeselection?: boolean;
  trueLabel?: ReactNode;
  falseLabel?: ReactNode;
  dataTestId?: string;
}

export function BooleanRadioField({
  name,
  label,
  orientation = "horizontal",
  allowDeselection = false,
  trueLabel,
  falseLabel,
  dataTestId,
}: BooleanRadioGroupFieldProps) {
  const { t } = useTranslation();
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
        data-testid={dataTestId}
        onChange={(event) =>
          void helpers.setValue(event.currentTarget.value === "true")
        }
      >
        <Radio
          value
          label={trueLabel ?? t("common.yes")}
          onClick={handleDeselect(true)}
        />
        <Radio
          value={false}
          label={falseLabel ?? t("common.no")}
          onClick={handleDeselect(false)}
        />
      </RadioGroup>
    </FormControl>
  );
}
