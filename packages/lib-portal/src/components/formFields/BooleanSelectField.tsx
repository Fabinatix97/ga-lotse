/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Option, Select, SelectProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { NO_SELECTION_LABEL } from "../../helpers/form";
import { isEmptyString } from "../../helpers/guards";
import { useTranslation } from "../../i18n/useTranslation";
import { FieldProps, OptionalFieldValue } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { BaseField, FieldComponentProps, useBaseField } from "./BaseField";
import { FieldVariantProps } from "./types";

export interface BooleanSelectFieldProps
  extends FieldProps<OptionalFieldValue<boolean>>,
    FieldComponentProps,
    FieldVariantProps {
  labelTrue?: string;
  labelFalse?: string;
  placeholder?: string;
  disabled?: boolean;
  allowDeselection?: boolean;
  select?: (
    props: SelectProps<OptionalFieldValue<boolean>, false>,
  ) => ReactNode;
  onChange?: (value: OptionalFieldValue<boolean>) => void;
  sx?: SxProps;
}

export function BooleanSelectField(props: BooleanSelectFieldProps) {
  const { t } = useTranslation();
  const FieldComponent = props.component ?? BaseField;
  const SelectComponent = props.select ?? Select;
  const field = useBaseField<OptionalFieldValue<boolean>>(props);
  const disabled = useIsFormDisabled();

  return (
    <FieldComponent
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      fieldDecorator={props.fieldDecorator}
      disabled={disabled || props.disabled}
      sx={props.sx}
    >
      <SelectComponent
        name={props.name}
        value={isEmptyString(field.input.value) ? null : field.input.value}
        placeholder={props.placeholder}
        color={props.primary ? "primary" : undefined}
        onChange={(_, newValue) => {
          const newFieldValue = newValue ?? "";
          void field.helpers.setValue(newFieldValue);
          if (isDefined(props.onChange)) {
            props.onChange(newFieldValue);
          }
        }}
        onBlur={(event) => {
          // The relatedTarget is a <li> when the dropdown is opened,
          // we don't want to trigger the blur in that case.
          if (event.relatedTarget instanceof HTMLInputElement) {
            field.input.onBlur(event);
          }
        }}
      >
        <Option value>{props.labelTrue ?? t("common.yes")}</Option>
        <Option value={false}>{props.labelFalse ?? t("common.no")}</Option>
        {props.allowDeselection && (
          <Option value="">{NO_SELECTION_LABEL}</Option>
        )}
      </SelectComponent>
    </FieldComponent>
  );
}
