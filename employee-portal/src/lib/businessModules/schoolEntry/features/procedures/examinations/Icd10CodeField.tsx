/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SoftRequiredInput } from "@eshg/lib-portal/businessModules/schoolEntry/features/procedures/fieldVariants";
import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { HorizontalField } from "@eshg/lib-portal/components/formFields/HorizontalField";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { FieldProps, SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { Search } from "@mui/icons-material";
import { Input, InputProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { theme } from "@/lib/baseModule/theme/theme";

export type ClickIcd10CodeHandler = (
  currentCodes: string[],
  setFieldValue: (newCodes: string[]) => void,
) => void;

export const FIXED_WIDTH_STYLE: SxProps = {
  ".MuiInput-root": { width: "140px" },
};

interface Icd10CodeFieldProps extends Omit<FieldProps<string[]>, "label"> {
  values: string[];
  disabled?: boolean;
  setFieldValue: SetFieldValueHelper;
  onClickIcd10Code: ClickIcd10CodeHandler;
  softRequired?: boolean;
}

export function Icd10CodeField(props: Icd10CodeFieldProps) {
  const disabled = useIsFormDisabled();

  function Icd10CodeInput(inputProps: InputProps) {
    const InputComponent = props.softRequired ? SoftRequiredInput : Input;

    return (
      <InputComponent
        {...inputProps}
        value={
          Array.isArray(inputProps.value)
            ? inputProps.value.join(", ")
            : inputProps.value
        }
      />
    );
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
