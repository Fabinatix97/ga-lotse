/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, FormLabel, Select, SelectProps } from "@mui/joy";
import { useSearchParams } from "next/navigation";

import { ResetButton } from "@/lib/components/table/ResetButton";
import {
  SelectOption,
  SelectOptions,
} from "@/lib/components/table/SelectOptions";
import { useReplaceSearchParams } from "@/lib/hooks/useReplaceSearchParams";

export function SingleSelectFilter(
  props: Readonly<{
    searchParamName: string;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
    label?: string;
  }>,
) {
  const replaceSearchParams = useReplaceSearchParams();
  const searchParams = useSearchParams();

  const selectProps: SelectProps<string, false> = {
    value: searchParams.get(props.searchParamName),
    multiple: false,
    onChange(_event, value: string | null) {
      replaceSearchParams([
        {
          name: props.searchParamName,
          value,
        },
      ]);
    },
  };

  if (selectProps.value != null) {
    selectProps.indicator = null;
    selectProps.endDecorator = (
      <ResetButton
        onReset={() => {
          replaceSearchParams([
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
    <FormControl sx={{ flexBasis: 135 }}>
      {props.label && (
        <FormLabel
          slotProps={{
            root: {
              id: props.searchParamName,
            },
          }}
        >
          {props.label}
        </FormLabel>
      )}
      <Select
        size="sm"
        placeholder={props.placeholder}
        disabled={props.disabled}
        slotProps={{
          button: {
            id: "single-select-button-" + props.searchParamName,
            "aria-labelledby": props.searchParamName,
          },
        }}
        {...selectProps}
      >
        <SelectOptions options={props.options} />
      </Select>
    </FormControl>
  );
}
