/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateTimeField } from "@eshg/lib-employee-portal";
import { DateField } from "@eshg/lib-portal";

export function DateOrDateTimeField({
  wholeDay,
  name,
  label,
  required,
  autoFocus,
}: {
  wholeDay: boolean;
  name: string;
  label: string;
  required: string;
  autoFocus?: boolean;
}) {
  return wholeDay ? (
    <DateField
      name={name}
      autoFocus={autoFocus}
      label={label}
      required={required}
    />
  ) : (
    <DateTimeField
      name={name}
      autoFocus={autoFocus}
      label={label}
      required={required}
    />
  );
}
