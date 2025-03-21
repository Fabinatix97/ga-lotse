/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SelectOption,
  SelectOptions,
} from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Select, SelectProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isNonNullish } from "remeda";

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
      onChange={(event, value) => {
        // event is null when the select changes without user interaction,
        // this seems to happen randomly when the page re-renders due to changed query parameters
        if (isNonNullish(event)) {
          props.onChange?.(event, value);
        }
      }}
    >
      <SelectOptions options={props.options} />
    </Select>
  );
}
