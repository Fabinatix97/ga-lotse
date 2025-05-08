/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormControl, FormLabel, Input } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useSearchParams } from "next/navigation";
import { ChangeEventHandler, useCallback, useRef } from "react";

import { useReplaceSearchParams } from "@/lib/hooks/useReplaceSearchParams";

export function DateFilter(
  props: Readonly<{
    searchParamName: string;
    placeholder: string;
    sx?: SxProps;
    debounceTimeoutMs?: number;
  }>,
) {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const value = event.target.value;
      const date = new Date(value);
      if (isNaN(date as unknown as number)) return;

      if (props.debounceTimeoutMs == undefined) {
        replaceSearchParams([
          {
            name: props.searchParamName,
            value: date.toISOString().slice(0, 10),
          },
        ]);
        return;
      }
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        replaceSearchParams([
          {
            name: props.searchParamName,
            value: date.toISOString().slice(0, 10),
          },
        ]);
      }, props.debounceTimeoutMs);
    },
    [props.debounceTimeoutMs, props.searchParamName, replaceSearchParams],
  );

  return (
    <FormControl>
      <FormLabel>{props.placeholder}</FormLabel>
      <Input
        type="date"
        defaultValue={searchParams.get(props.searchParamName) ?? ""}
        size="sm"
        sx={{
          ...props.sx,
        }}
        placeholder={props.placeholder}
        aria-label={props.placeholder}
        onChange={handleChange}
      />
    </FormControl>
  );
}
