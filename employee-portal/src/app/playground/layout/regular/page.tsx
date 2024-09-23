/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Sheet, Slider, Switch, Typography } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { doNothing } from "remeda";

import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

interface TestData {
  name: string;
}

const columnHelper = createColumnHelper<TestData>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
];

export default function PlaygroundMainContentLayoutPage() {
  const [filterSettingsVisible, setFilterSettingsVisible] = useState(false);
  const [fullViewportHeight, setFullViewportHeight] = useState(true);
  const [itemCount, setItemCount] = useState(10);

  const data = Array.from({ length: itemCount }, (_, i) => ({
    name: `test ${i}`,
  }));

  // Controls only for the demo. These will never be part of a real page.
  const controls = (
    <Sheet>
      <Typography
        component="label"
        endDecorator={
          <Switch
            checked={filterSettingsVisible}
            onChange={(event) => setFilterSettingsVisible(event.target.checked)}
          />
        }
      >
        filterSettingsVisible
      </Typography>
      <Typography
        component="label"
        endDecorator={
          <Switch
            checked={fullViewportHeight}
            onChange={(event) => setFullViewportHeight(event.target.checked)}
          />
        }
      >
        fullViewportHeight
      </Typography>
      <Slider
        value={itemCount}
        onChange={(_event, value) => setItemCount(value as number)}
        step={5}
        marks
        min={0}
        max={100}
        valueLabelDisplay="auto"
      />
    </Sheet>
  );

  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Regular layout with title" />}
    >
      <MainContentLayout fullViewportHeight={fullViewportHeight}>
        <TablePage
          fullHeight
          controls={controls}
          filterSettings={
            filterSettingsVisible && (
              <FilterSettingsSheet onApply={doNothing} isDirty={true}>
                <FilterSettings
                  definitions={[]}
                  draftValues={[]}
                  onDraftValueChange={doNothing}
                  showActiveFilters={false}
                  activeFilterProps={{
                    filterValues: [],
                    maxVisible: 5,
                    deleteAllFilterValues: doNothing,
                    deleteFilterValue: doNothing,
                    getFilterValueLabel: () => "",
                  }}
                />
              </FilterSettingsSheet>
            )
          }
        >
          <TableSheet>
            <DataTable data={data} columns={columns} />
          </TableSheet>
        </TablePage>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
