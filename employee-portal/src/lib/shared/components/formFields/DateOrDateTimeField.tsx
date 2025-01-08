/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DateField } from "@eshg/lib-portal/components/formFields/DateField";

import { DateTimeField } from "./DateTimeField";

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
