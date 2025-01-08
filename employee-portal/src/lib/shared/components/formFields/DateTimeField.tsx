/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  InputField,
  InputFieldProps,
} from "@eshg/lib-portal/components/formFields/InputField";
import { validatePipe } from "@eshg/lib-portal/helpers/validators";

import { validateDateTime } from "@/lib/shared/helpers/validators";

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
