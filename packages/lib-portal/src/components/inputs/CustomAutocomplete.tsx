/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AutocompleteProps,
  Autocomplete as JoyAutocomplete,
  createFilterOptions,
} from "@mui/joy";
import { useState } from "react";

import { LiveAnnouncer } from "../liveAnnouncer/LiveAnnouncer";

type CustomAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> = AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>;

export function CustomAutocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(props: CustomAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const [announce, setAnnounce] = useState(false);

  return (
    <>
      <JoyAutocomplete
        {...props}
        filterOptions={(options, state) => {
          const resultOptions =
            props.filterOptions?.(options, state) ??
            createFilterOptions<T>()(options, state);
          setAnnounce(resultOptions.length === 0);
          return resultOptions;
        }}
        slotProps={{
          clearIndicator: {
            tabIndex: 0,
          },
        }}
        aria-description={
          props["aria-description"] ??
          (props.multiple ? "Mehrfachauswahl möglich" : undefined)
        }
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
