/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";

import { CustomAutocomplete } from "@eshg/lib-portal";

import { canonicalColumnId } from "@/lib/hooks/useEntities";
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
    <CustomAutocomplete
      freeSolo
      autoSelect
      value={searchParams.get(canonicalColumnId(props.searchParamName)) ?? ""}
      size="sm"
      placeholder={props.placeholder}
      aria-label={props.placeholder}
      options={props.options}
      aria-labelledby={props.searchParamName}
      onChange={(_event, value) => {
        replaceSearchParams([
          {
            name: canonicalColumnId(props.searchParamName),
            value: value,
          },
        ]);
      }}
    />
  );
}
