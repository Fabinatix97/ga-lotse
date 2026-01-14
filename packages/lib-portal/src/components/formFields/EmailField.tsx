/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { validatePipe } from "../../helpers/validators";
import { useValidateEmail } from "../../hooks/useValidators";

import { InputField, InputFieldProps } from "./InputField";

type EmailFieldProps = Omit<InputFieldProps, "type">;

export function EmailField(props: EmailFieldProps) {
  const validateEmail = useValidateEmail();

  return (
    <InputField
      {...props}
      type="email"
      validate={validatePipe(validateEmail, props.validate)}
    />
  );
}
