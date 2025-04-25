/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useState } from "react";

import { UseTableControlResult } from "@eshg/lib-employee-portal";

export function TextInputFilter(
  props: Readonly<{
    searchParamName: string;
    placeholder: string;
    tableControl: UseTableControlResult;
    sx?: SxProps;
  }>,
) {
  const [value, setValue] = useState(
    props.tableControl.getFilter(props.searchParamName) ?? "",
  );

  function updateSearchParam() {
    if (value === (props.tableControl.getFilter(props.searchParamName) ?? "")) {
      return;
    }

    props.tableControl.setFilter([
      {
        name: props.searchParamName,
        value: value,
      },
    ]);
  }

  return (
    <Input
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyUp={(event) => {
        if (event.key === "Enter") {
          updateSearchParam();
        }
      }}
      onBlur={updateSearchParam}
      size="sm"
      sx={{
        width: 140,
        ...props.sx,
      }}
      placeholder={props.placeholder}
      aria-label={props.placeholder}
    />
  );
}
