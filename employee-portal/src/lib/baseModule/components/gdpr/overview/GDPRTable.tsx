/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";

import { ApiUserRole, GetGdprProceduresRequest } from "@eshg/base-api";
import {
  ButtonBar,
  DataTable,
  FilterSettingsContent,
  FilterSettingsSheet,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  gdprRoutes,
  useHasUserRoleCheck,
  useTableControl,
} from "@eshg/lib-employee-portal";

import { useGetGdprProcedureOverviewQuery } from "@/lib/baseModule/api/queries/gdpr";
import { useCreateGDPRProcedureSidebar } from "@/lib/baseModule/components/gdpr/overview/CreateGDPRProcedureSidebar";
import { columns } from "@/lib/baseModule/components/gdpr/overview/columns";
import { useGdprProcedureFilterSettings } from "@/lib/baseModule/components/gdpr/overview/useGdprFilterSettings";

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
          left={<ToggleFilterButton {...filterSettings.filterButtonProps} />}
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
            route: (row) => gdprRoutes.details(row.original.id),
          }}
          minWidth="65rem"
        />
      </TableSheet>
    </TablePage>
  );
}
