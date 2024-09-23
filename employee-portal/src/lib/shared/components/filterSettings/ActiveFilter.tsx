/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

// eslint-disable-next-line no-restricted-imports
import { Chip, ChipDelete, Link, Stack, Typography } from "@mui/joy";
import { useState } from "react";

export interface ActiveFilter<TKey extends string = string> {
  key: TKey;
}

export interface ActiveFilterProps<TKey extends string = string> {
  filterValues: ActiveFilter<TKey>[];
  deleteFilterValue: (key: TKey) => void;
  deleteAllFilterValues: () => void;
  maxVisible: number;
  getFilterValueLabel: (filterValue: ActiveFilter<TKey>) => string;
}

interface ActiveFilterChipProps<TKey extends string = string> {
  filterValue: ActiveFilter<TKey>;
  deleteFilterValue: () => void;
  getFilterValueLable: (filterValue: ActiveFilter<TKey>) => string;
}

export function ActiveFilter<TKey extends string = string>(
  props: ActiveFilterProps<TKey>,
) {
  return (
    <Stack gap={1} data-testid="activeFilters">
      <Stack justifyContent="space-between" direction="row">
        <Typography level="body-md">Aktive Filter:</Typography>
        <Link
          data-testid="resetAllActiveFilters"
          component="button"
          underline="none"
          color="primary"
          onClick={() => props.deleteAllFilterValues()}
        >
          Löschen
        </Link>
      </Stack>
      <ActiveFilterList
        filterValues={props.filterValues}
        deleteFilterValue={props.deleteFilterValue}
        maxVisible={props.maxVisible}
        getFilterValueLabel={props.getFilterValueLabel}
      />
    </Stack>
  );
}

function ActiveFilterList<TKey extends string = string>(
  props: Omit<ActiveFilterProps<TKey>, "deleteAllFilterValues">,
) {
  const [showAll, setShowAll] = useState(false);

  return (
    <Stack gap={1} data-testid="activeFilterList">
      <Stack gap={1} flexDirection="row" flexWrap="wrap">
        {props.filterValues
          .slice(0, showAll ? props.filterValues.length : props.maxVisible)
          .map((filterValue) => (
            <ActiveFilterChip
              key={filterValue.key}
              filterValue={filterValue}
              deleteFilterValue={() => props.deleteFilterValue(filterValue.key)}
              getFilterValueLable={props.getFilterValueLabel}
            />
          ))}
      </Stack>
      {props.filterValues.length > props.maxVisible && (
        <Link
          component={"button"}
          underline="always"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll
            ? "Weniger anzeigen"
            : `Alle anzeigen (${props.filterValues.length})`}
        </Link>
      )}
    </Stack>
  );
}

function ActiveFilterChip<TKey extends string = string>(
  props: ActiveFilterChipProps<TKey>,
) {
  return (
    <Chip
      variant={"soft"}
      color={"primary"}
      endDecorator={
        <ChipDelete aria-label="Entfernen" onDelete={props.deleteFilterValue} />
      }
      size="sm"
      sx={{
        alignItems: "flex-start",
        gap: 0.75,
      }}
      slotProps={{
        label: {
          sx: { maxWidth: "185px" },
        },
      }}
    >
      {props.getFilterValueLable(props.filterValue)}
    </Chip>
  );
}
