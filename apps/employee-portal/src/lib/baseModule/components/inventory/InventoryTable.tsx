/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/joy";

import { ApiUserRole, GetInventoryItemsRequest } from "@eshg/base-api";
import {
  ButtonBar,
  DataTable,
  FilterSettingsContent,
  FilterSettingsSheet,
  Pagination,
  SearchFilter,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  useHasUserRoleCheck,
  useTableControl,
} from "@eshg/lib-employee-portal";

import { useGetInventoryOverviewPageQuery } from "@/lib/baseModule/api/queries/inventory";
import { useInventoryFilterSettings } from "@/lib/baseModule/components/inventory/hooks/useInventoryFilterSettings";
import { useAddInventorySidebar } from "@/lib/baseModule/components/inventory/modals/AddInventorySidebar";
import { useInventoryCountCorrectionSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryCountCorrectionSidebar";
import { useInventoryRestockSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryRestockSidebar";
import { useInventoryUpdateSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryUpdateSidebar";
import { routes } from "@/lib/baseModule/shared/routes";

import { inventoryColumns } from "./columns";

interface InventoryTableProps {
  params: GetInventoryItemsRequest;
}

export function InventoryTable({ params }: InventoryTableProps) {
  const isAdmin = useHasUserRoleCheck(ApiUserRole.BaseInventoryAdministrate);
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
  });

  const addInventorySidebar = useAddInventorySidebar();
  const inventoryUpdateSidebar = useInventoryUpdateSidebar();
  const inventoryCountCorrectionSidebar = useInventoryCountCorrectionSidebar();
  const inventoryRestockSidebar = useInventoryRestockSidebar();

  const {
    data: { elements, totalNumberOfElements, labels },
    isFetching,
  } = useGetInventoryOverviewPageQuery(params);

  const filterSettings = useInventoryFilterSettings({
    tableControl: tableControl,
    labelFilter: params.label,
    typeFilter: params.type,
    labels: labels,
  });

  return (
    <TablePage
      data-testid="inventory-table"
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
        <ButtonBar
          left={
            <Stack direction="row" flexWrap="wrap" gap="inherit">
              <ToggleFilterButton {...filterSettings.filterButtonProps} />
              <SearchFilter
                tableControl={tableControl}
                searchParamName="name"
                label="Suche"
              />
            </Stack>
          }
          right={
            isAdmin && (
              <Button
                autoFocus
                startDecorator={<AddIcon />}
                sx={{
                  justifySelf: "flex-end",
                }}
                onClick={() => addInventorySidebar.open({ labels })}
              >
                Inventar hinzufügen
              </Button>
            )
          }
          invertDomOrder
        />
      }
    >
      <TableSheet
        loading={isFetching}
        footer={
          <Pagination
            totalCount={totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={elements}
          minWidth="60rem"
          sorting={tableControl.tableSorting}
          rowNavigation={{
            route: (row) => routes.inventory.details(row.original.id),
            focusColumnAccessorKey: "name",
          }}
          columns={inventoryColumns({
            isAdmin,
            onCorrection: (item) =>
              inventoryCountCorrectionSidebar.open({ item }),
            onEdit: (item) =>
              inventoryUpdateSidebar.open({ inventory: item, labels }),
            onRestock: (item) =>
              inventoryRestockSidebar.open({
                id: item.id,
                minCount: item.minCount,
              }),
          })}
        />
      </TableSheet>
    </TablePage>
  );
}
