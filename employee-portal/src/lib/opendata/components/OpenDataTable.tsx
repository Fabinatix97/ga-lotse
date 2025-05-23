/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import Add from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/joy";
import { useSearchParams } from "next/navigation";

import {
  DataTable,
  FilterSettings,
  FilterSettingsSheet,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  useConfirmationDialog,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  parseOptionalString,
  parseReadonlyPageParams,
} from "@eshg/lib-portal/universal";
import { ApiResource, ApiVersion } from "@eshg/opendata-api";

import { useEntryDetailsSidebar } from "@/lib/opendata/components/EntryDetailsSidebar";
import { useNewEntrySidebar } from "@/lib/opendata/components/NewEntrySidebar";
import { openDataColumns } from "@/lib/opendata/components/openDataColumns";
import { deleteVersionDialogOptions } from "@/lib/opendata/helper";
import {
  getOpenDataFilters,
  useOpenDataFilterSettings,
} from "@/lib/opendata/hooks/useOpenDataFilterSettings";
import { useDeleteVersion } from "@/lib/opendata/mutations/opendata";
import { useGetOpenDocuments } from "@/lib/opendata/queries/opendata";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";

export function OpenDataTable() {
  const tableControl = useTableControl({ serverSideSorting: true });
  const { openConfirmationDialog } = useConfirmationDialog();
  const newEntrySidebar = useNewEntrySidebar();
  const entryDetailsSidebar = useEntryDetailsSidebar();

  const searchParams = useSearchParams();
  const filterSettings = useOpenDataFilterSettings();

  const deleteVersion = useDeleteVersion();
  const { data } = useGetOpenDocuments({
    searchString: parseOptionalString(searchParams.get("searchQuery")),
    ...parseReadonlyPageParams(searchParams),
    ...getOpenDataFilters(filterSettings.activeValues),
  });

  function handleAddNewEntry() {
    newEntrySidebar.open({
      prefilledValues: { resourceName: "", versionName: "" },
    });
  }

  function handleAddNewVersion(entry: ApiResource) {
    const latestVersionName = entry.versions[0]?.versionName ?? "";
    newEntrySidebar.open({
      prefilledValues: {
        resourceName: entry.resourceName,
        versionName: latestVersionName,
      },
    });
  }

  function handleDeleteVersion(version: ApiVersion) {
    openConfirmationDialog({
      ...deleteVersionDialogOptions(version),
      onConfirm: () => deleteVersion.mutate({ versionId: version.externalId }),
    });
  }

  return (
    <TablePage
      aria-label="Einträge"
      fullHeight
      controls={
        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          justifyContent="space-between"
          gap={2}
        >
          <Stack direction="row" flexWrap="wrap" gap="inherit">
            <ToggleFilterButton {...filterSettings.filterButtonProps} />
            <SearchFilter
              tableControl={tableControl}
              searchParamName="searchQuery"
              label="Suche"
            />
          </Stack>
          <Button startDecorator={<Add />} onClick={handleAddNewEntry}>
            Datensatz anlegen
          </Button>
        </Stack>
      }
      filterSettings={
        filterSettings.filterSettingsVisible && (
          <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
            <FilterSettings {...filterSettings.filterSettingsProps} />
          </FilterSettingsSheet>
        )
      }
    >
      <TableSheet
        footer={
          <Pagination
            totalCount={data.totalElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={data.elements}
          columns={openDataColumns({
            handleAddNewVersion,
            handleDeleteVersion,
          })}
          getSubRows={(row) => row.subRows}
          rowNavigation={{
            onClick: ({ original }) => {
              const { type, data } = original;
              if (type !== "version") {
                return;
              }
              return () =>
                entryDetailsSidebar.open({ versionId: data.externalId });
            },
            focusColumnAccessorKey: "name",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
