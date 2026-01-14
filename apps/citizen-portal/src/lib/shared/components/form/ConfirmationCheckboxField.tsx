/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Checkbox,
  FormControl,
  FormLabel,
  FormLabelProps,
  styled,
} from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import {
  FieldProps,
  renderHelperText,
  useBaseField,
  useIsServer,
} from "@eshg/lib-portal";

const DescriptionText = styled("div")({
  marginLeft: "1.875rem", // checkbox width + gap between checkbox and label
});

interface ConfirmationCheckboxFieldProps
  extends Omit<FieldProps<boolean>, "label"> {
  label: string;
  descriptionText?: ReactNode;
}

export function ConfirmationCheckboxField(
  props: ConfirmationCheckboxFieldProps,
) {
  const { input, error, helperText } = useBaseField<boolean>({
    type: "checkbox",
    name: props.name,
    validate: createValueCheckedValidation(props.required),
  });
  const isServer = useIsServer();

  return (
    <FormControl error={error} orientation="vertical">
      <Checkbox
        name={input.name}
        label={props.label}
        checked={input.checked}
        value={input.value.toString()}
        variant="outlined"
        color="primary"
        disabled={isServer}
        required={props.required !== undefined}
        slots={{
          label: RequiredFormLabel, // Joy UI does not pass required flag to checkbox labels
        }}
        onChange={input.onChange}
        onBlur={input.onBlur}
      />
      {isDefined(props.descriptionText) && (
        <DescriptionText>{props.descriptionText}</DescriptionText>
      )}
      {isDefined(helperText) && renderHelperText(helperText)}
    </FormControl>
  );
}

function RequiredFormLabel(props: FormLabelProps) {
  return <FormLabel sx={{ display: "inline" }} {...props} required />;
}

function createValueCheckedValidation(
  requiredText = "Bitte Zustimmung erteilen um fortzufahren.",
) {
  return (value: boolean) => {
    if (value) {
      return undefined;
    }

    return requiredText;
  };
}
