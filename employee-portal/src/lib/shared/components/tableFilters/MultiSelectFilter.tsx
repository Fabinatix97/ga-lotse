/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SelectOption,
  SelectOptions,
} from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Select } from "@mui/joy";

import { UseTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

export function MultiSelectFilter(props: {
  searchParamName: string;
  options: readonly SelectOption[];
  placeholder: string;
  tableControl: UseTableControl;
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
