/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Option } from "@mui/joy";

export interface SelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

export function SelectOptions(props: { options: SelectOption[] }) {
  return props.options.map((option) => (
    <Option
      key={option.value}
      value={option.value}
      onClick={(event) => event.stopPropagation()}
    >
      {option.label}
    </Option>
  ));
}
