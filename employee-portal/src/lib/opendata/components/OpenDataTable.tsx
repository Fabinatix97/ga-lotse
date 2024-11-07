/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiResource, ApiVersion } from "@eshg/employee-portal-api/opendata";
import Add from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/joy";
import { useParams } from "next/navigation";

import { routes } from "@/lib/baseModule/shared/routes";
import { NewEntrySidebar } from "@/lib/opendata/components/NewEntrySidebar";
import { ViewEntrySidebar } from "@/lib/opendata/components/ViewEntrySidebar";
import { openDataColumns } from "@/lib/opendata/components/openDataColumns";
import { deleteVersionDialogOptions } from "@/lib/opendata/helper";
import {
  getOpenDataFilters,
  useOpenDataFilterSettings,
} from "@/lib/opendata/hooks/useOpenDataFilterSettings";
import { useDeleteVersion } from "@/lib/opendata/mutations/opendata";
import { useGetOpenDocuments } from "@/lib/opendata/queries/opendata";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useSidebarWithFormRef } from "@/lib/shared/hooks/useSidebarWithFormRef";

export function OpenDataTable() {
  const { openConfirmationDialog } = useConfirmationDialog();
  const newEntrySidebar = useSidebarWithFormRef({
    component: NewEntrySidebar,
  });

  const filterSettings = useOpenDataFilterSettings();

  const deleteVersion = useDeleteVersion();
  const { data } = useGetOpenDocuments({
    ...getOpenDataFilters(filterSettings.activeValues),
  });

  const { id } = useParams();
  const selectedVersion = data
    .flatMap((resource) => resource.subRows ?? [])
    .find((version) => version.data.externalId === id);

  function handleAddNewEntry() {
    newEntrySidebar.open({ prefilledValues: { resourceName: "" } });
  }

  function handleAddNewVersion(entry: ApiResource) {
    newEntrySidebar.open({
      prefilledValues: { resourceName: entry.resourceName },
    });
  }

  function handleDeleteVersion(version: ApiVersion) {
    openConfirmationDialog({
      ...deleteVersionDialogOptions(version),
      onConfirm: () => deleteVersion.mutate({ versionId: version.externalId }),
    });
  }

  return (
    <>
      <TablePage
        fullHeight
        controls={
          <ButtonBar
            left={
              <Stack direction="row" gap={2} flexWrap="wrap-reverse">
                <FilterButton {...filterSettings.filterButtonProps} />
                {/* <SearchFilter
                  tableControl={tableControl}
                  searchParamName="name"
                  label="Suche"
                /> */}
              </Stack>
            }
            right={
              <Button onClick={handleAddNewEntry} startDecorator={<Add />}>
                Datensatz anlegen
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
          <DataTable
            data={data}
            columns={openDataColumns({
              handleAddNewVersion,
              handleDeleteVersion,
            })}
            getSubRows={(row) => row.subRows}
            rowNavigation={{
              route: (row) => {
                const { data, type } = row.original;
                if (type !== "version") {
                  return undefined;
                }
                return routes.opendata.details(data.externalId);
              },
              focusColumnAccessorKey: "name",
            }}
          />
        </TableSheet>
      </TablePage>

      {selectedVersion && (
        <OverlayBoundary>
          <ViewEntrySidebar version={selectedVersion} />
        </OverlayBoundary>
      )}
    </>
  );
}
