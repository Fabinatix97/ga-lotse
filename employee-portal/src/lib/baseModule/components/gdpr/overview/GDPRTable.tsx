/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole, GetGdprProceduresRequest } from "@eshg/base-api";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";

import { useGetGdprProcedureOverviewQuery } from "@/lib/baseModule/api/queries/gdpr";
import { useCreateGDPRProcedureSidebar } from "@/lib/baseModule/components/gdpr/overview/CreateGDPRProcedureSidebar";
import { columns } from "@/lib/baseModule/components/gdpr/overview/columns";
import { useGdprProcedureFilterSettings } from "@/lib/baseModule/components/gdpr/overview/useGdprFilterSettings";
import { routes } from "@/lib/baseModule/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettingsContent } from "@/lib/shared/components/filterSettings/FilterSettingsContent";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

export function GDPRTable({ params }: { params: GetGdprProceduresRequest }) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseGdprProcedureWrite);
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    initialSorting: {
      id: "dueDate",
      desc: false,
    },
  });
  const {
    data: { elements, totalNumberOfElements },
    isFetching,
  } = useGetGdprProcedureOverviewQuery(params);
  const sidebar = useCreateGDPRProcedureSidebar();

  const filterSettings = useGdprProcedureFilterSettings({
    typeFilter: params.type,
    tableControl,
  });

  return (
    <TablePage
      fullHeight
      data-testid="gdpr-procedures-table"
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
          left={<FilterButton {...filterSettings.filterButtonProps} />}
          right={
            hasWritePerms && (
              <Button
                onClick={() => sidebar.open()}
                startDecorator={<AddIcon />}
              >
                DSGVO Vorgang anlegen
              </Button>
            )
          }
          invertDomOrder={true}
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
          columns={columns}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          rowNavigation={{
            focusColumnAccessorKey: "identificationData",
            route: (row) => routes.gdpr.details(row.original.id),
          }}
          minWidth="65rem"
        />
      </TableSheet>
    </TablePage>
  );
}
