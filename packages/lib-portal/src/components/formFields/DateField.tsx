/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateDate, validatePipe } from "../../helpers/validators";

import { InputField, InputFieldProps } from "./InputField";

type DateFieldProps = Omit<InputFieldProps, "type">;

export function DateField(props: DateFieldProps) {
  return (
    <InputField
      {...props}
      type="date"
      validate={validatePipe(validateDate, props.validate)}
    />
  );
}
