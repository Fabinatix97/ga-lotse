/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Select } from "@mui/joy";

import { SelectOption, SelectOptions } from "@eshg/lib-portal";

import { UseTableControlResult } from "../../table/hooks/useTableControl";

export function MultiSelectFilter(props: {
  searchParamName: string;
  options: readonly SelectOption[];
  placeholder: string;
  tableControl: UseTableControlResult;
}) {
  const selectProps = props.tableControl.getMultiSelectProps(
    props.searchParamName,
  );

  return (
    <Select
      size="sm"
      sx={{
        width: "10rem",
      }}
      placeholder={props.placeholder}
      aria-label={props.placeholder}
      {...selectProps}
    >
      <SelectOptions options={props.options} />
    </Select>
  );
}
