/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  InputField,
  InputFieldProps,
} from "@eshg/lib-portal/components/formFields/InputField";
import {
  validatePipe,
  validateTime,
} from "@eshg/lib-portal/helpers/validators";

type TimeFieldProps = Omit<InputFieldProps, "type">;

export function TimeField(props: TimeFieldProps) {
  return (
    <InputField
      {...props}
      type="time"
      validate={validatePipe(validateTime, props.validate)}
    />
  );
}
