/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { Button, Switch, Typography } from "@mui/joy";
import { useState } from "react";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import {
  NumberFilterComparisonMode,
  NumberFilterNullInclusion,
  NumberFilterNumericComparison,
} from "@/lib/shared/components/filterSettings/models/NumberFilter";
import { useFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

const filterDefinitions: FilterDefinition[] = [
  {
    type: "Enum",
    key: "gender",
    name: "Kind: Geschlecht",
    options: [
      { label: "Weiblich", value: "Weiblich" },
      { label: "Männlich", value: "Männlich" },
      { label: "Divers", value: "Divers" },
      { label: "Keine Angabe", value: "Keine Angabe" },
    ],
  },
  {
    type: "Enum",
    key: "migration-background",
    name: "Migrationshintergrund",
    options: [
      { label: "Ja", value: "Ja" },
      { label: "Nein", value: "Nein" },
    ],
  },
  {
    type: "Number",
    key: "test-result",
    name: "Ergebnis Stereosehen, Langtest",
    minValue: -5.0,
    maxValue: 5.0,
    unit: undefined,
  },
  {
    type: "EnumSingle",
    key: "some-options",
    name: "Einzelne Option",
    placeholder: "Bitte wählen...",
    options: [
      { label: "Option 1", value: "option-1" },
      { label: "Option 2", value: "option-2" },
      { label: "Option 3", value: "option-3" },
      { label: "Option 4", value: "option-4" },
      { label: "Option 5", value: "option-5" },
      { label: "Option 6", value: "option-6" },
      { label: "Option 7", value: "option-7" },
      { label: "Option 8", value: "option-8" },
      { label: "Option 9", value: "option-9" },
    ],
  },
  {
    type: "Date",
    key: "date",
    name: "Date",
  },
  {
    type: "DateSpan",
    key: "date-span",
    name: "Date Span",
  },
  {
    type: "DateComparison",
    key: "date-comparison",
    name: "Date Comparison",
  },
  { type: "Year", key: "year", name: "Year" },
  { type: "Text", key: "text", name: "Text" },
];

const initialValues: FilterValue[] = [
  {
    type: "Number",
    key: "test-result",
    comparison: {
      type: NumberFilterComparisonMode.Value,
      numericComparison: NumberFilterNumericComparison.GreaterThan,
      value: 2,
      nullInclusion: NumberFilterNullInclusion.IncludeNull,
    },
  },
];

export default function PlaygroundFilterSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoApplyFilters, setAutoApplyFilters] = useState(false);

  const filterSettings = useFilterSettings({
    definitions: filterDefinitions,
    initialValues: initialValues,
    autoApply: autoApplyFilters,
    onValuesSubmit: (values) => {
      // eslint-disable-next-line no-console
      console.log(values);
    },
  });

  return (
    <MainContentLayout fullViewportHeight>
      <TablePage
        fullHeight
        controls={
          <ButtonBar
            left={
              <>
                <FilterButton {...filterSettings.filterButtonProps} />
                <Typography
                  component="label"
                  endDecorator={
                    <Switch
                      checked={autoApplyFilters}
                      onChange={(event) =>
                        setAutoApplyFilters(event.target.checked)
                      }
                    />
                  }
                >
                  autoApplyFilters
                </Typography>
              </>
            }
            right={
              <Button
                color="neutral"
                variant="outlined"
                onClick={() => setSidebarOpen(true)}
              >
                Toggle Sidebar
              </Button>
            }
          />
        }
        filterSettings={
          filterSettings.filterSettingsVisible && (
            <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
              <FilterSettings {...filterSettings.filterSettingsProps} />
            </FilterSettingsSheet>
          )
        }
      >
        <TableSheet>
          <DataTable data={[]} columns={[]} />
        </TableSheet>
      </TablePage>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <SidebarContent title="Filter festlegen">
          <FilterSettings {...filterSettings.filterSettingsProps} />
        </SidebarContent>
      </Sidebar>
    </MainContentLayout>
  );
}
