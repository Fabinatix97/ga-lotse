/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AutocompleteProps,
  Autocomplete as JoyAutocomplete,
  createFilterOptions,
} from "@mui/joy";
import { useRef } from "react";

import { LiveAnnouncer } from "../liveAnnouncer/LiveAnnouncer";

export interface CustomAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  inputRef?: (el: HTMLElement) => void;
}

export function CustomAutocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(props: CustomAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const filteredOptionsLengthRef = useRef<number>(null);
  const announce = filteredOptionsLengthRef.current === 0;

  return (
    <>
      <JoyAutocomplete
        {...props}
        filterOptions={(options, state) => {
          const resultOptions =
            props.filterOptions?.(options, state) ??
            createFilterOptions<T>()(options, state);
          filteredOptionsLengthRef.current = resultOptions.length;
          return resultOptions;
        }}
        slotProps={{
          clearIndicator: {
            tabIndex: 0,
          },
          input: {
            ref: (el) => {
              if (el) {
                props.inputRef?.(el);
              }
            },
            "aria-description":
              props["aria-description"] ??
              (props.multiple ? "Mehrfachauswahl möglich" : undefined),
          },
        }}
        sx={{
          "& .MuiAutocomplete-clearIndicator": {
            visibility: "visible",
          },
          ...props.sx,
        }}
      />
      <LiveAnnouncer message="Keine Einträge vorhanden." active={announce} />
    </>
  );
}
