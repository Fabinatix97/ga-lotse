/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  InputField,
  InputFieldProps,
  validateDateTime,
  validatePipe,
} from "@eshg/lib-portal";

type DateTimeFieldProps = Omit<InputFieldProps, "type">;

export function DateTimeField(props: DateTimeFieldProps) {
  return (
    <InputField
      {...props}
      type="datetime-local"
      validate={validatePipe(validateDateTime, props.validate)}
    />
  );
}
