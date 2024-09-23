/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SelectOption,
  SelectOptions,
} from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Select, SelectProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

export function RowsPerPageSelect(props: {
  value: string;
  onChange: SelectProps<string, false>["onChange"];
  options: SelectOption[];
  sx?: SxProps;
}) {
  return (
    <Select
      aria-label="Zeilen pro Seite"
      size="sm"
      color="primary"
      sx={{
        borderRadius: "md",
        ...props.sx,
      }}
      value={props.value}
      onChange={props.onChange}
    >
      <SelectOptions options={props.options} />
    </Select>
  );
}
