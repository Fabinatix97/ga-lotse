/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Autocomplete } from "@mui/joy";
import { useSearchParams } from "next/navigation";

import { useReplaceSearchParams } from "@/lib/hooks/useReplaceSearchParams";

export function TextInputFilter(
  props: Readonly<{
    searchParamName: string;
    placeholder?: string;
    options: string[];
  }>,
) {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  return (
    <Autocomplete
      freeSolo
      autoSelect
      value={searchParams.get(props.searchParamName) ?? ""}
      onChange={(_event, value) => {
        replaceSearchParams([
          {
            name: props.searchParamName,
            value: value,
          },
        ]);
      }}
      size="sm"
      placeholder={props.placeholder}
      aria-label={props.placeholder}
      options={props.options}
      aria-labelledby={props.searchParamName}
    />
  );
}
