/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  InputField,
  InputFieldProps,
} from "@eshg/lib-portal/components/formFields/InputField";

type PhoneNumberFieldProps = Omit<InputFieldProps, "type">;

export function PhoneNumberField(props: PhoneNumberFieldProps) {
  return <InputField {...props} type="tel" />;
}
