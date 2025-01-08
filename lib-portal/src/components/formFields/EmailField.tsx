/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateEmail, validatePipe } from "../../helpers/validators";

import { InputField, InputFieldProps } from "./InputField";

type EmailFieldProps = Omit<InputFieldProps, "type">;

export function EmailField(props: EmailFieldProps) {
  return (
    <InputField
      {...props}
      type="email"
      validate={validatePipe(validateEmail, props.validate)}
    />
  );
}
