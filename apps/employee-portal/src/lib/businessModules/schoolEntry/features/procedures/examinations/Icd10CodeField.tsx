/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Search } from "@mui/icons-material";
import { Input, InputProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useField } from "formik";

import {
  FieldProps,
  HorizontalField,
  InputField,
  SetFieldValueHelper,
  SoftRequiredInput,
  useIsFormDisabled,
} from "@eshg/lib-portal";
import { ApiIcd10CodeWithOriginalCode } from "@eshg/school-entry-api";

import { theme } from "@/lib/baseModule/theme/theme";

export type ClickIcd10CodeHandler = (
  currentCodes: ApiIcd10CodeWithOriginalCode[],
  setFieldValue: (newCodes: ApiIcd10CodeWithOriginalCode[]) => void,
) => void;

const FIXED_WIDTH_STYLE: SxProps = {
  ".MuiInput-root": { width: "140px" },
};

interface Icd10CodeFieldProps extends Omit<
  FieldProps<ApiIcd10CodeWithOriginalCode[]>,
  "label"
> {
  values: ApiIcd10CodeWithOriginalCode[];
  disabled?: boolean;
  setFieldValue: SetFieldValueHelper;
  onClickIcd10Code: ClickIcd10CodeHandler;
  softRequired?: boolean;
}

export function Icd10CodeField(props: Icd10CodeFieldProps) {
  const disabled = useIsFormDisabled();

  function Icd10CodeInput(inputProps: InputProps) {
    const InputComponent = props.softRequired ? SoftRequiredInput : Input;
    const { value } = useField<ApiIcd10CodeWithOriginalCode[]>(props.name)[1];
    const selectedCodes = value
      .map(({ originalCode }) => originalCode)
      .join(", ");

    return <InputComponent {...inputProps} value={selectedCodes} />;
  }

  function handleClickIcd10Codes() {
    props.onClickIcd10Code(props.values, (newCodes) => {
      void props.setFieldValue(props.name, newCodes);
    });
  }

  return (
    // TODO: use custom field instead of InputField to store string[] (InputField stores string)
    <InputField
      name={props.name}
      label="ICD-10"
      unstyledReadOnly
      disabled={disabled || props.disabled}
      sx={FIXED_WIDTH_STYLE}
      component={HorizontalField}
      input={Icd10CodeInput}
      endDecorator={
        <Search
          htmlColor={
            props.disabled
              ? theme.palette.neutral.outlinedDisabledColor
              : "neutral"
          }
        />
      }
      onClick={handleClickIcd10Codes}
    />
  );
}
