/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { format } from "date-fns";

import { auditLogAuthorizeColumns } from "@/lib/auditlog/components/authorize/auditLogAuthorizeColumns";
import { useAuditLogAdminFilterSettings } from "@/lib/auditlog/components/authorize/useAuditLogAdminFilterSettings";
import { useGetAvailableAuditLogs } from "@/lib/auditlog/queries/auditlog";
import { routes } from "@/lib/baseModule/shared/routes";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { useBuildRoutePreservingSearchParams } from "@/lib/shared/components/procedures/hooks/useBuildRoutePreservingSearchParams";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SearchParams } from "@/lib/shared/helpers/searchParams";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

export function AuditLogAuthorizePage(
  props: Readonly<{
    searchParams: SearchParams;
  }>,
) {
  const tableControl = useTableControl();
  const buildRoutePreservingSearchParams =
    useBuildRoutePreservingSearchParams();

  const { data: response } = useGetAvailableAuditLogs(props.searchParams);

  const filterSettings = useAuditLogAdminFilterSettings({
    tableControl: tableControl,
    searchParams: props.searchParams,
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
            route: (row) =>
              buildRoutePreservingSearchParams(
                routes.auditlog.authorize.grantAccess(
                  row.original.auditLogSource,
                  format(row.original.createdAt, "yyyy-MM-dd"),
                ),
              ),
            focusColumnAccessorKey: "auditLogSource",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
