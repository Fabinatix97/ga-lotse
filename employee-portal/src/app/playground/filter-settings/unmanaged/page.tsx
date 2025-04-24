/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ActiveFilter,
  ButtonBar,
  DataTable,
  FilterSettingsContent,
  FilterSettingsSheet,
  MainContentLayout,
  TablePage,
  TableSheet,
  ToggleFilterButton,
} from "@eshg/lib-employee-portal";
import { isDateString } from "@eshg/lib-portal/helpers/dateTime";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ToggleButtonGroup,
} from "@mui/joy";
import { useId, useState } from "react";
import { isNonNullish } from "remeda";

interface PlaygroundFilter {
  key: string;
  name: string;
  value: string | null;
}

export default function PlaygroundFilterSettingsUnmanagedPage() {
  const [filterVisible, setFilterVisible] = useState(false);

  const [filters, setFilters] = useState<PlaygroundFilter[]>([
    {
      key: "date",
      name: "Date Filter",
      value: null,
    },
    {
      key: "buttonGroup",
      name: "Button Group Filter",
      value: null,
    },
  ]);
  const filtersId = useId();

  const activeFilters = filters.filter((filter) => isNonNullish(filter.value));

  function getFilter(key: string) {
    return filters.find((filter) => filter.key === key)!;
  }

  function setFilterValue(key: string, value: string | null) {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.key === key ? { ...filter, value } : filter,
      ),
    );
  }

  function clearFilterValues() {
    setFilters((prevFilters) =>
      prevFilters.map((filter) => ({ ...filter, value: null })),
    );
  }

  return (
    <MainContentLayout fullViewportHeight>
      <TablePage
        fullHeight
        controls={
          <ButtonBar
            left={
              <ToggleFilterButton
                isFilterVisible={filterVisible}
                activeFilters={activeFilters.length}
                onClick={() => setFilterVisible((prev) => !prev)}
                aria-controls={filtersId}
              />
            }
          />
        }
        filterSettings={
          filterVisible && (
            <FilterSettingsSheet id={filtersId}>
              <FilterSettingsContent
                showActiveFilters={activeFilters.length > 0}
                activeFilters={
                  <ActiveFilter
                    maxVisible={5}
                    filterValues={activeFilters}
                    deleteAllFilterValues={clearFilterValues}
                    deleteFilterValue={(key) => setFilterValue(key, null)}
                    getFilterValueLabel={({ key }) => getFilter(key).name}
                  />
                }
              >
                <FormControl>
                  <FormLabel>Date Filter</FormLabel>
                  <Input
                    type="date"
                    value={getFilter("date").value ?? ""}
                    onChange={(event) => {
                      setFilterValue(
                        "date",
                        isDateString(event.target.value)
                          ? event.target.value
                          : null,
                      );
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Button Group Filter</FormLabel>
                  <ToggleButtonGroup
                    value={getFilter("buttonGroup").value}
                    onChange={(_event, value) => {
                      setFilterValue("buttonGroup", value);
                    }}
                  >
                    <Button fullWidth value="One">
                      One
                    </Button>
                    <Button fullWidth value="Two">
                      Two
                    </Button>
                    <Button fullWidth value="Three">
                      Three
                    </Button>
                  </ToggleButtonGroup>
                </FormControl>
              </FilterSettingsContent>
            </FilterSettingsSheet>
          )
        }
      >
        <TableSheet>
          <DataTable data={[]} columns={[]} />
        </TableSheet>
      </TablePage>
    </MainContentLayout>
  );
}
