/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Radio } from "@mui/joy";
import { FormikContextType, useFormikContext } from "formik";
import { ReactNode, memo } from "react";

import { Row } from "@eshg/lib-portal/components/Row";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";

import {
  BooleanRadioGroupField,
  BooleanRadioGroupFieldProps,
} from "@/lib/businessModules/officialMedicalService/shared/BooleanRadioGroupField";

export interface BooleanRadioFieldProps extends BooleanRadioGroupFieldProps {
  trueLabel?: string | ReactNode;
  falseLabel?: string | ReactNode;
  readOnly?: boolean;
  resettable?: true;
  additionalField?: ReactNode;
}

export function BooleanRadioField({
  resettable,
  additionalField,
  trueLabel,
  falseLabel,
  ...props
}: BooleanRadioFieldProps) {
  const formDisabled = useIsFormDisabled();

  function handleChange() {
    if (props.readOnly) {
      return;
    }
  }

  return (
    <BooleanRadioGroupField {...props} onChange={handleChange}>
      <BooleanRadioButtons
        name={props.name}
        disabled={formDisabled}
        readOnly={props.readOnly}
        orientation={props.orientation}
        required={!!props.required}
        onReset={() => handleChange()}
        resettable={resettable}
        additionalField={additionalField}
        falseLabel={falseLabel}
        trueLabel={trueLabel}
      />
    </BooleanRadioGroupField>
  );
}

interface BooleanRadioButtonsProps
  extends Omit<BooleanRadioFieldProps, "required"> {
  disabled?: boolean;
  required?: boolean;
  onReset?: () => void;
}

function BooleanRadioButtons(props: BooleanRadioButtonsProps) {
  const { getFieldMeta, setFieldValue } = useFormikContext();
  const { value } = getFieldMeta<boolean>(props.name);

  return (
    <MemoizedBooleanRadioButtons
      inputValue={value}
      setFieldValue={setFieldValue}
      {...props}
    />
  );
}

const MemoizedBooleanRadioButtons = memo(InnerBooleanRadioButtons);

interface InnerBooleanRadioButtonsProps extends BooleanRadioButtonsProps {
  inputValue: boolean;
  setFieldValue: FormikContextType<unknown>["setFieldValue"];
}
function InnerBooleanRadioButtons({
  inputValue,
  trueLabel = "Ja",
  falseLabel = "Nein",
  setFieldValue,
  ...props
}: InnerBooleanRadioButtonsProps) {
  function handleReset() {
    void setFieldValue(props.name, null);
    props.onReset?.();
  }

  const showResetButton =
    props.resettable &&
    !props.disabled &&
    !props.required &&
    !props.readOnly &&
    !inputValue;

  const verticalOrientation = props.orientation === "vertical";

  return (
    <Row flexDirection={props.orientation ? "column" : "row"}>
      <Radio
        value={true}
        label={trueLabel}
        disabled={props.disabled}
        readOnly={props.readOnly}
      />
      <Radio
        value={false}
        label={falseLabel}
        disabled={props.disabled}
        readOnly={props.readOnly}
      />

      {props.additionalField}
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
