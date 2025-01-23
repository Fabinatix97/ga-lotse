/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiResource, ApiVersion } from "@eshg/employee-portal-api/opendata";
import {
  parseOptionalString,
  parseReadonlyPageParams,
} from "@eshg/lib-portal/helpers/searchParams";
import Add from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/joy";
import { useSearchParams } from "next/navigation";

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
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

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
            <FilterButton {...filterSettings.filterButtonProps} />
            <SearchFilter
              tableControl={tableControl}
              searchParamName="searchQuery"
              label="Suche"
            />
          </Stack>
          <Button onClick={handleAddNewEntry} startDecorator={<Add />}>
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
