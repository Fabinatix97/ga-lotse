/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  styled,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { ValidationRules } from "@/lib/shared/components/form/TextareaField";

const DescriptionText = styled("div")({
  marginLeft: "1.875rem", // checkbox width + gap between checkbox and label
});

interface ConfirmationCheckboxFieldProps extends ValidationRules<string> {
  name: string;
  label: string;
  descriptionText?: ReactNode;
  sx?: SxProps;
}

export function CheckboxField({
  label,
  descriptionText,
  ...props
}: ConfirmationCheckboxFieldProps) {
  const { input, error, helperText, required } = useBaseField<boolean>({
    type: "checkbox",
    name: props.name,
    validate: (value: boolean) => {
      if (value) {
        return undefined;
      }
      return props.required;
    },
  });

  return (
    <FormControl error={error} orientation="vertical" required={required}>
      <Checkbox
        name={input.name}
        label={label}
        checked={input.checked}
        value={input.value.toString()}
        variant="outlined"
        color="primary"
        required
        slots={{
          label: RequiredFormLabel, // Joy UI does not pass required flag to checkbox labels
        }}
        onChange={input.onChange}
        onBlur={input.onBlur}
        sx={props.sx}
      />
      {isDefined(descriptionText) && (
        <DescriptionText>{descriptionText}</DescriptionText>
      )}
      {isDefined(helperText) && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

function RequiredFormLabel(props: FormLabelProps) {
  return <FormLabel sx={{ display: "inline" }} {...props} required />;
}
