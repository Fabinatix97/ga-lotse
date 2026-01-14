/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeleteOutlined as DeleteIcon } from "@mui/icons-material";
import { Box, FormLabel, IconButton, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ComponentType, ReactNode } from "react";

import { useTranslation } from "../../i18n/useTranslation";
import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";
import { FormAddMoreButton } from "../form/FormAddMoreButton";

import { useBaseField } from "./BaseField";
import { DecoratedInputField } from "./DecoratedInputField";
import { FieldArrayWithFocus as FieldArray } from "./FieldArrayWithFocus";
import { InputField, InputFieldProps } from "./InputField";

type SupportInputFieldProps = Pick<
  InputFieldProps,
  "name" | "label" | "required" | "validate" | "fieldDecorator" | "sx"
>;

interface InputArrayFieldProps extends Omit<FieldProps<string[]>, "label"> {
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
  const { t } = useTranslation();
  const FieldComponent = props.fieldComponent ?? InputField;
  const field = useBaseField(props);
  const minCount = Math.max(1, props.minCount ?? 1);
  const canRemove = field.input.value.length > minCount;
  const disabled = useIsFormDisabled();

  return (
    <FieldArray
      valueLength={field.input.value.length}
      name={props.name}
      validateOnChange={false}
    >
      {({ push, remove, setInputElementRef }) => (
        <Stack gap={2}>
          {field.input.value.map((_value, index) => (
            <Box
              key={index}
              display="contents"
              role="group"
              aria-labelledby={`${props.name}.${index}`}
            >
              <FieldComponent
                ref={(el) => setInputElementRef(el, index)}
                name={`${props.name}.${index}`}
                label={
                  <Box display="contents" id={`${props.name}.${index}`}>
                    <FormLabel>{props.label(index)}</FormLabel>
                  </Box>
                }
                required={props.required}
                validate={props.validateEach}
                component={DecoratedInputField}
                fieldDecorator={
                  <IconButton
                    sx={{
                      display: canRemove ? undefined : "none",
                    }}
                    color="danger"
                    aria-label={t("common.delete")}
                    disabled={disabled}
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={props.sx}
                disabled={disabled}
              />
            </Box>
          ))}
          <FormAddMoreButton
            disabled={disabled}
            onClick={() => {
              push("");
            }}
          >
            {props.addMoreLabel}
          </FormAddMoreButton>
        </Stack>
      )}
    </FieldArray>
  );
}
