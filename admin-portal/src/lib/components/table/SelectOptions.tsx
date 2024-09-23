/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
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
      onClick={(event) => event.stopPropagation()}
      key={option.value}
      value={option.value}
    >
      {option.label}
    </Option>
  ));
}
