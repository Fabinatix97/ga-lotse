/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SelectOption,
  SelectOptions,
} from "@eshg/lib-portal/components/formFields/SelectOptions";
import { SxProps } from "@mui/joy/styles/types";
import { isNonNullish } from "remeda";

import { ResettableSingleSelect } from "@/lib/shared/components/ResettableSingleSelect";
import { UseTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

export function SingleSelectFilter(props: {
  searchParamName: string;
  placeholder: string;
  options: readonly SelectOption[];
  tableControl: UseTableControl;
  sx?: SxProps;
}) {
  const selectProps = props.tableControl.getSingleSelectProps(
    props.searchParamName,
  );

  if (isNonNullish(selectProps.value)) {
    selectProps.indicator = null;
  }

  return (
    <ResettableSingleSelect
      size="sm"
      sx={{ width: 140, ...props.sx }}
      placeholder={props.placeholder}
      aria-label={props.placeholder}
      onResetSelect={() => {
        props.tableControl.setFilter([
          { name: props.searchParamName, value: undefined },
        ]);
      }}
      {...selectProps}
    >
      <SelectOptions options={props.options} />
    </ResettableSingleSelect>
  );
}
