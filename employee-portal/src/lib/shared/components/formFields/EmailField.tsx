/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  InputField,
  InputFieldProps,
} from "@eshg/lib-portal/components/formFields/InputField";
import { validatePipe } from "@eshg/lib-portal/helpers/validators";

import { validateEmail } from "@/lib/shared/helpers/validators";

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
