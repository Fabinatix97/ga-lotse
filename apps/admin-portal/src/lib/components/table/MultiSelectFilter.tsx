/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Select, SelectProps } from "@mui/joy";
import { useSearchParams } from "next/navigation";

import {
  SelectOption,
  SelectOptions,
} from "@/lib/components/table/SelectOptions";
import { useReplaceSearchParams } from "@/lib/hooks/useReplaceSearchParams";

export function MultiSelectFilter(
  props: Readonly<{
    searchParamName: string;
    options: SelectOption[];
    placeholder?: string;
  }>,
) {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const selectProps: SelectProps<string, true> = {
    value: searchParams.getAll(props.searchParamName),
    multiple: true,
    onChange(_event, value: string[]) {
      replaceSearchParams([
        {
          name: props.searchParamName,
          value,
        },
      ]);
    },
  };

  return (
    <Select
      size="sm"
      placeholder={props.placeholder}
      slotProps={{
        button: {
          id: "multi-select-button-" + props.searchParamName,
          "aria-labelledby": props.searchParamName,
        },
      }}
      {...selectProps}
    >
      <SelectOptions options={props.options} />
    </Select>
  );
}
