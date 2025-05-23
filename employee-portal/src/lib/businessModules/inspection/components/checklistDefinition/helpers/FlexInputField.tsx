/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField, TextareaField, Validator } from "@eshg/lib-portal";

import {
  InputFieldBar,
  InputFieldBarProps,
} from "@/lib/businessModules/inspection/components/checklistDefinition/helpers/InputFieldBar";

export interface FlexInputFieldProps extends InputFieldBarProps {
  name: string;
  label: string;
  validate?: Validator<string>;
  required?: string;
  placeholder: string;
  multiline?: boolean;
  disabled?: boolean;
}

export function FlexInputField({
  multiline,
  startDecorator,
  endDecorator,
  sx,
  ...props
}: Readonly<FlexInputFieldProps>) {
  return (
    <InputFieldBar
      startDecorator={startDecorator}
      input={
        multiline ? (
          <TextareaField
            {...props}
            aria-label={props.label}
            minRows={2}
            sx={{ flex: 1 }}
          />
        ) : (
          <InputField {...props} aria-label={props.label} sx={{ flex: 1 }} />
        )
      }
      endDecorator={endDecorator}
      sx={sx}
    />
  );
}
