/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import {
  ButtonBar,
  DataTable,
  FilterSettings,
  FilterSettingsSheet,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { PageProps } from "@eshg/lib-portal";

import { useAuditLogAuthorizeSidebar } from "@/lib/auditlog/components/authorize/AuditLogAuthorizeSidebar";
import { auditLogAuthorizeColumns } from "@/lib/auditlog/components/authorize/auditLogAuthorizeColumns";
import { useAuditLogAdminFilterSettings } from "@/lib/auditlog/components/authorize/useAuditLogAdminFilterSettings";
import { useGetAvailableAuditLogs } from "@/lib/auditlog/queries/auditlog";

export function AuditLogAuthorizePage(props: PageProps) {
  const searchParams = use(props.searchParams);
  const tableControl = useTableControl();
  const authorizeSidebar = useAuditLogAuthorizeSidebar();

  const { data: response } = useGetAvailableAuditLogs(searchParams);

  const filterSettings = useAuditLogAdminFilterSettings({
    tableControl: tableControl,
    searchParams,
  });

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={<ToggleFilterButton {...filterSettings.filterButtonProps} />}
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
      <TableSheet
        footer={
          <Pagination
            totalCount={response.totalElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={response.logs}
          columns={auditLogAuthorizeColumns}
          rowNavigation={{
            onClick: (row) => () =>
              authorizeSidebar.open({
                source: row.original.auditLogSource,
                date: row.original.createdAt,
              }),
            focusColumnAccessorKey: "auditLogSource",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
