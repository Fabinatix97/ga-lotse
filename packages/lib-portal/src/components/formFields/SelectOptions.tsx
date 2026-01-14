/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Option } from "@mui/joy";
import { ReactNode } from "react";

export interface SelectOption<
  TValue extends string = string,
  TLabel extends string | ReactNode = string,
> {
  label: TLabel;
  value: TValue;
}

export function optionsFromRecord(record: Record<string, string>) {
  return Object.entries(record).map(([recordKey, recordValue]) => ({
    value: recordKey,
    label: recordValue,
  }));
}

export function SelectOptions<
  TOptionLabel extends string | ReactNode = string,
>(props: { options: readonly SelectOption<string, TOptionLabel>[] }) {
  return props.options.map((option) => (
    <Option key={option.value} value={option.value}>
      {option.label}
    </Option>
  ));
}
