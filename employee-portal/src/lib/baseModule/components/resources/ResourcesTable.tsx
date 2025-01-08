/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiUserRole,
  GetResourcesRequest,
} from "@eshg/employee-portal-api/base";
import AddIcon from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/joy";

import { useGetResourcesOverviewQuery } from "@/lib/baseModule/api/queries/resources";
import { useResourcesFilterSettings } from "@/lib/baseModule/components/resources/hooks/useResourcesFilterSettings";
import { useAddResourceSidebar } from "@/lib/baseModule/components/resources/sidebar/AddResourceSidebar";
import { routes } from "@/lib/baseModule/shared/routes";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettingsContent } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { resourceTableColumns } from "./columns";

interface ResourcesTableProps {
  params: GetResourcesRequest;
}

export function ResourcesTable({ params }: ResourcesTableProps) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseResourcesWrite);
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
  });

  const {
    data: { labels, resources },
    isFetching,
  } = useGetResourcesOverviewQuery(params);

  const addResourceSidebar = useAddResourceSidebar();

  const filterSettings = useResourcesFilterSettings({
    tableControl: tableControl,
    labelFilter: params.label,
    typeFilter: params.type,
    labels: labels.elements,
  });

  return (
    <>
      <TablePage
        data-testid="resources-table"
        fullHeight
        filterSettings={
          filterSettings.filterSheetVisible && (
            <FilterSettingsSheet>
              <FilterSettingsContent
                {...filterSettings.filterSettingsContentProps}
              />
            </FilterSettingsSheet>
          )
        }
        controls={
          <Stack
            direction={"row"}
            gap={2}
            flexWrap={"wrap-reverse"}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} gap={"inherit"} flexWrap={"wrap"}>
              <FilterButton {...filterSettings.filterButtonProps} />
              <SearchFilter
                tableControl={tableControl}
                searchParamName={"name"}
                label={"Suche"}
              />
            </Stack>
            {hasWritePerms && (
              <Button
                onClick={() =>
                  addResourceSidebar.open({
                    labels: labels.elements,
                  })
                }
                startDecorator={<AddIcon />}
              >
                Ressource hinzufügen
              </Button>
            )}
          </Stack>
        }
      >
        <TableSheet
          loading={isFetching}
          footer={
            <Pagination
              totalCount={resources.totalNumberOfElements}
              {...tableControl.paginationProps}
            />
          }
        >
          <DataTable
            data={resources.elements}
            columns={resourceTableColumns}
            sorting={tableControl.tableSorting}
            rowNavigation={{
              route: (row) => routes.resources.details(row.original.id),
              focusColumnAccessorKey: "name",
            }}
            minWidth="60rem"
          />
        </TableSheet>
      </TablePage>
    </>
  );
}
