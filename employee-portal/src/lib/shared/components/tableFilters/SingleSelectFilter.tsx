/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SelectOption,
  SelectOptions,
} from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Select } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isNonNullish } from "remeda";

import { ResetButton } from "@/lib/shared/components/ResetButton";
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
    selectProps.endDecorator = (
      <ResetButton
        onReset={() => {
          props.tableControl.setFilter([
            {
              name: props.searchParamName,
              value: undefined,
            },
          ]);
        }}
      />
    );
  }

  return (
    <Select
      size="sm"
      sx={{
        width: 140,
        ...props.sx,
      }}
      placeholder={props.placeholder}
      aria-label={props.placeholder}
      {...selectProps}
    >
      <SelectOptions options={props.options} />
    </Select>
  );
}
