/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PageProps } from "@eshg/lib-portal/types/pageParams";

import { useAuditLogAuthorizeSidebar } from "@/lib/auditlog/components/authorize/AuditLogAuthorizeSidebar";
import { auditLogAuthorizeColumns } from "@/lib/auditlog/components/authorize/auditLogAuthorizeColumns";
import { useAuditLogAdminFilterSettings } from "@/lib/auditlog/components/authorize/useAuditLogAdminFilterSettings";
import { useGetAvailableAuditLogs } from "@/lib/auditlog/queries/auditlog";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

export function AuditLogAuthorizePage(props: PageProps) {
  const searchParams = props.searchParams;
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
          left={<FilterButton {...filterSettings.filterButtonProps} />}
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
