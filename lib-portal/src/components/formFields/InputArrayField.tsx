/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteOutlined as DeleteIcon } from "@mui/icons-material";
import { FormLabel, IconButton, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FieldArray } from "formik";
import { ComponentType, ReactNode } from "react";

import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";
import { FormAddMoreButton } from "../form/FormAddMoreButton";

import { useBaseField } from "./BaseField";
import { DecoratedInputField } from "./DecoratedInputField";
import { InputField, InputFieldProps } from "./InputField";

type SupportInputFieldProps = Pick<
  InputFieldProps,
  "name" | "label" | "required" | "validate" | "fieldDecorator" | "sx"
>;

export interface InputArrayFieldProps
  extends Omit<FieldProps<string[]>, "label"> {
  minCount?: number;
  addMoreLabel: string;
  fieldComponent?: ComponentType<SupportInputFieldProps>;
  validateEach?: FieldProps<string>["validate"];
  sx?: SxProps;
  label: (index: number) => ReactNode;
}

export function getIndexLabel(label: ReactNode, index: number) {
  return (
    <>
      {index + 1}. {label}
    </>
  );
}

export function InputArrayField(props: InputArrayFieldProps) {
  const FieldComponent = props.fieldComponent ?? InputField;
  const field = useBaseField(props);
  const minCount = Math.max(1, props.minCount ?? 1);
  const canRemove = field.input.value.length > minCount;
  const disabled = useIsFormDisabled();

  return (
    <FieldArray name={props.name} validateOnChange={false}>
      {({ push, remove }) => (
        <Stack gap={2}>
          {field.input.value.map((_value, index) => (
            <FieldComponent
              key={index}
              name={`${props.name}.${index}`}
              label={<FormLabel>{props.label(index)}</FormLabel>}
              required={props.required}
              validate={props.validateEach}
              component={DecoratedInputField}
              fieldDecorator={
                <IconButton
                  sx={{
                    display: canRemove ? undefined : "none",
                  }}
                  color={"danger"}
                  aria-label={"Entfernen"}
                  onClick={() => remove(index)}
                  disabled={disabled}
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={props.sx}
              disabled={disabled}
            />
          ))}
          <FormAddMoreButton onClick={() => push("")} disabled={disabled}>
            {props.addMoreLabel}
          </FormAddMoreButton>
        </Stack>
      )}
    </FieldArray>
  );
}
