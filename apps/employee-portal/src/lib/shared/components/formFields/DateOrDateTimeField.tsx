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
}: {
  wholeDay: boolean;
  name: string;
  label: string;
  required: string;
}) {
  return wholeDay ? (
    <DateField name={name} label={label} required={required} />
  ) : (
    <DateTimeField name={name} label={label} required={required} />
  );
}
