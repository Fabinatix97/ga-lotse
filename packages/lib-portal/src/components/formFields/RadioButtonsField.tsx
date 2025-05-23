/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Radio } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FormikContextType, useFormikContext } from "formik";
import { ReactNode, memo } from "react";

import { useTranslation } from "../../i18n/useTranslation";
import { ValidationRules } from "../../types/form";
import { Row } from "../Row";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { RadioGroupField } from "./RadioGroupField";
import { SelectOption } from "./SelectOptions";

export interface RadioButtonsFieldProps<T extends SelectOption = SelectOption>
  extends ValidationRules<T["value"] | null> {
  options: T[];
  name: string;
  label?: string | ReactNode;
  orientation?: "vertical" | "horizontal";
  onChange?: (value: T["value"] | null) => unknown;
  sx?: SxProps;
  // Retains the styling of the radio buttons but prevents onChange from being called
  readOnly?: boolean;
  // Disables the radio buttons
  disabled?: boolean;
  "data-testid"?: string;
  resettable?: true;
  additionalField?: ReactNode;
  resetLabel?: string;
  onReset?: () => unknown;
}

export function RadioButtonsField<T extends SelectOption = SelectOption>({
  onChange,
  onReset,
  resettable,
  additionalField,
  resetLabel,
  ...props
}: RadioButtonsFieldProps<T>) {
  const formDisabled = useIsFormDisabled();
  function handleChange(value: string | null) {
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
        resetLabel={resetLabel}
        options={props.options}
        name={props.name}
        disabled={formDisabled || props.disabled}
        readOnly={props.readOnly}
        orientation={props.orientation}
        required={!!props.required}
        resettable={resettable}
        additionalField={additionalField}
        onReset={() => {
          handleChange(null);
          if (onReset) onReset();
        }}
      />
    </RadioGroupField>
  );
}

interface RadioButtonsProps<T extends SelectOption> {
  name: string;
  options: T[];
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  orientation?: "vertical" | "horizontal";
  onReset?: () => void;
  resettable?: true;
  resetLabel?: string;
  additionalField?: ReactNode;
}

function RadioButtons<T extends SelectOption>(props: RadioButtonsProps<T>) {
  const { getFieldMeta, setFieldValue } = useFormikContext();

  return (
    <MemoizedRadioButtons
      {...props}
      value={getFieldMeta<T>(props.name).value}
      setFieldValue={setFieldValue}
    />
  );
}

const MemoizedRadioButtons = memo(InnerRadioButtons);

interface InnerRadioButtonsProps<T extends SelectOption>
  extends RadioButtonsProps<T> {
  value: T;
  setFieldValue: FormikContextType<T>["setFieldValue"];
}

function InnerRadioButtons<T extends SelectOption>({
  name,
  options,
  disabled,
  readOnly,
  orientation,
  required,
  onReset,
  resettable,
  resetLabel,
  additionalField,
  value,
  setFieldValue,
}: InnerRadioButtonsProps<T>) {
  const { t } = useTranslation();

  function handleReset() {
    void setFieldValue(name, null);
    onReset?.();
  }

  const showResetButton =
    resettable && !disabled && !required && !readOnly && !!value;

  const verticalOrientation = orientation === "vertical";

  return (
    <Row flexDirection={verticalOrientation ? "column" : "row"}>
      {options.map((t) => (
        <Radio
          key={name + t.value}
          value={t.value}
          label={t.label}
          disabled={disabled}
          readOnly={readOnly}
        />
      ))}
      {additionalField}
      {showResetButton ? (
        <Button
          variant="plain"
          size="sm"
          sx={{
            marginTop: !verticalOrientation ? "-0.375rem" : undefined,
            marginBottom: !verticalOrientation ? "-0.375rem" : undefined,
            maxWidth: "min-content",
            fontWeight: 400,
          }}
          onClick={handleReset}
        >
          {resetLabel ?? t("common.reset")}
        </Button>
      ) : undefined}
    </Row>
  );
}
