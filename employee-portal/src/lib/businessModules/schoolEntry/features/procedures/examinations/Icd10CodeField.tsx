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
import { InputProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { theme } from "@/lib/baseModule/theme/theme";

export type ClickIcd10CodeHandler = (
  currentCodes: string[],
  setFieldValue: (newCodes: string[]) => void,
) => void;

function Icd10CodeInput(props: InputProps) {
  return (
    <SoftRequiredInput
      {...props}
      value={Array.isArray(props.value) ? props.value.join(", ") : props.value}
    />
  );
}

export const FIXED_WIDTH_STYLE: SxProps = {
  ".MuiInput-root": { width: "140px" },
};

interface Icd10CodeFieldProps extends Omit<FieldProps<string[]>, "label"> {
  values: string[];
  disabled?: boolean;
  setFieldValue: SetFieldValueHelper;
  onClickIcd10Code: ClickIcd10CodeHandler;
}

export function Icd10CodeField(props: Icd10CodeFieldProps) {
  const disabled = useIsFormDisabled();

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
      disabled={props.disabled ?? disabled}
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
