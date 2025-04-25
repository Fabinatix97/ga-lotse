/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Radio } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FormikContextType, useFormikContext } from "formik";
import { ReactNode, memo } from "react";

import { Row } from "@eshg/lib-portal/components/Row";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { ValidationRules } from "@eshg/lib-portal/types/form";

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
}

export function RadioButtonsField<T extends SelectOption = SelectOption>({
  onChange,
  resettable,
  additionalField,
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
        options={props.options}
        name={props.name}
        disabled={formDisabled || props.disabled}
        readOnly={props.readOnly}
        orientation={props.orientation}
        required={!!props.required}
        onReset={() => handleChange(null)}
        resettable={resettable}
        additionalField={additionalField}
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
  additionalField?: ReactNode;
}

function RadioButtons<T extends SelectOption>(props: RadioButtonsProps<T>) {
  const { getFieldMeta, setFieldValue } = useFormikContext();
  const { value } = getFieldMeta<T["value"]>(props.name);

  return (
    <MemoizedRadioButtons
      inputValue={value}
      setFieldValue={setFieldValue}
      {...props}
    />
  );
}

const MemoizedRadioButtons = memo(InnerRadioButtons);

interface InnerRadioButtonsProps<T extends SelectOption>
  extends RadioButtonsProps<T> {
  inputValue: T["value"];
  setFieldValue: FormikContextType<unknown>["setFieldValue"];
}
function InnerRadioButtons<T extends SelectOption>({
  inputValue,
  setFieldValue,
  name,
  options,
  disabled,
  readOnly,
  orientation,
  required,
  onReset,
  resettable,
  additionalField,
}: InnerRadioButtonsProps<T>) {
  function handleReset() {
    void setFieldValue(name, null);
    onReset?.();
  }

  const showResetButton =
    resettable && !disabled && !required && !readOnly && !!inputValue;

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
          Zurücksetzen
        </Button>
      ) : undefined}
    </Row>
  );
}
