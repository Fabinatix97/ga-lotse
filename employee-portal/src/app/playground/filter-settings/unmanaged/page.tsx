/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

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

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { ActiveFilter } from "@/lib/shared/components/filterSettings/ActiveFilter";
import { FilterSettingsContent } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

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
              <FilterButton
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
