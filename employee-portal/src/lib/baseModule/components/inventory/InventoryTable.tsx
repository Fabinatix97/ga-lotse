/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiInventoryItem,
  ApiUserRole,
  GetInventoryItemsRequest,
} from "@eshg/employee-portal-api/base";
import AddIcon from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/joy";
import { useState } from "react";
import { isDefined } from "remeda";

import { useGetInventoryOverviewPageQuery } from "@/lib/baseModule/api/queries/inventory";
import { useGetSelfUserPermissions } from "@/lib/baseModule/api/queries/users";
import { useInventoryFilterSettings } from "@/lib/baseModule/components/inventory/hooks/useInventoryFilterSettings";
import { AddInventorySidebar } from "@/lib/baseModule/components/inventory/modals/AddInventorySidebar";
import { InventoryCountCorrectionSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryCountCorrectionSidebar";
import { InventoryRestockSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryRestockSidebar";
import { InventoryUpdateSidebar } from "@/lib/baseModule/components/inventory/modals/InventoryUpdateSidebar";
import { routes } from "@/lib/baseModule/shared/routes";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettingsContent } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

import { inventoryColumns } from "./columns";

type SidebarState =
  | {
      type: "create";
    }
  | {
      type: "correction" | "edit" | "restock";
      item: ApiInventoryItem;
    };

interface InventoryTableProps {
  params: GetInventoryItemsRequest;
}

export function InventoryTable({ params }: InventoryTableProps) {
  const { data: selfUserPermissions } = useGetSelfUserPermissions();
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
  });

  const [action, setAction] = useState<SidebarState>();

  const { sidebarFormRef, closeSidebar, handleClose } = useSidebarForm({
    onClose: () => setAction(undefined),
  });

  const {
    data: { elements, totalNumberOfElements, labels },
    isFetching,
  } = useGetInventoryOverviewPageQuery(params);

  const isAdmin = selfUserPermissions.includes(
    ApiUserRole.BaseInventoryAdministrate,
  );

  const filterSettings = useInventoryFilterSettings({
    tableControl: tableControl,
    labelFilter: params.label,
    typeFilter: params.type,
    labels: labels,
  });

  return (
    <>
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
                searchParamName={"name"}
                label={"Suche"}
              />
            </Stack>
            {isAdmin && (
              <Button
                onClick={() =>
                  setAction({
                    type: "create",
                  })
                }
                startDecorator={<AddIcon />}
                sx={{
                  justifySelf: "flex-end",
                }}
              >
                Inventar hinzufügen
              </Button>
            )}
          </Stack>
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
            rowNavRoute={(row) => routes.inventory.details(row.original.id)}
            focusColumnHeader="Name"
            columns={inventoryColumns({
              isAdmin,
              onCorrection: (item) => setAction({ type: "correction", item }),
              onEdit: (item) => setAction({ type: "edit", item }),
              onRestock: (item) => setAction({ type: "restock", item }),
            })}
          />
        </TableSheet>
      </TablePage>

      <OverlayBoundary>
        <Sidebar open={isDefined(action)} onClose={handleClose}>
          {action?.type === "create" && (
            <AddInventorySidebar
              sidebarFormRef={sidebarFormRef}
              onClose={handleClose}
              labels={labels}
            />
          )}

          {action?.type === "edit" && (
            <InventoryUpdateSidebar
              sidebarFormRef={sidebarFormRef}
              inventory={action.item}
              labels={labels}
              onClose={handleClose}
              onSuccess={closeSidebar}
            />
          )}

          {action?.type === "correction" && (
            <InventoryCountCorrectionSidebar
              sidebarFormRef={sidebarFormRef}
              item={action.item}
              onClose={handleClose}
              onSuccess={closeSidebar}
            />
          )}

          {action?.type === "restock" && (
            <InventoryRestockSidebar
              sidebarFormRef={sidebarFormRef}
              id={action.item.id}
              minCount={action.item.minCount}
              onClose={handleClose}
              onSuccess={closeSidebar}
            />
          )}
        </Sidebar>
      </OverlayBoundary>
    </>
  );
}
