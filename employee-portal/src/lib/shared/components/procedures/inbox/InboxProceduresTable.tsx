/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiProcedureType } from "@eshg/employee-portal-api/businessProcedures";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { Stack } from "@mui/joy";

import { UseFetchInboxProcedures } from "@/lib/shared/api/queries/inboxProcedures";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { buildOptionsFromProcedureTypes } from "@/lib/shared/components/procedures/helper";
import { useBuildRoutePreservingSearchParams } from "@/lib/shared/components/procedures/hooks/useBuildRoutePreservingSearchParams";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { MultiSelectFilter } from "@/lib/shared/components/tableFilters/MultiSelectFilter";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

import { InboxProceduresPageRoutes } from "./InboxProceduresPage";
import { inboxProcedureColumns } from "./columns";
import { statusNames } from "./constants";

interface InboxProceduresTableProps {
  procedureTypes: ApiProcedureType[];
  useFetchInboxProcedures: UseFetchInboxProcedures;
  routes: InboxProceduresPageRoutes;
}

export function InboxProceduresTable(props: InboxProceduresTableProps) {
  const { inboxProcedures, totalElements } =
    props.useFetchInboxProcedures().data;
  const buildRoutePreservingSearchParams =
    useBuildRoutePreservingSearchParams();

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortDirectionName: "sortOrder",
    sortFieldName: "sortBy",
  });

  return (
    <TablePage
      data-testid="inbox-procedure-table"
      controls={
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <MultiSelectFilter
            searchParamName="inboxProcedureType"
            placeholder="Typ"
            options={buildOptionsFromProcedureTypes(props.procedureTypes)}
            tableControl={tableControl}
          />
          <MultiSelectFilter
            searchParamName="inboxProcedureStatus"
            placeholder="Status"
            options={optionsFromRecord(statusNames)}
            tableControl={tableControl}
          />
        </Stack>
      }
    >
      <TableSheet
        footer={
          <Pagination
            totalCount={totalElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={inboxProcedures}
          sorting={tableControl.tableSorting}
          columns={inboxProcedureColumns}
          rowNavRoute={(row) =>
            buildRoutePreservingSearchParams(
              props.routes.details(row.original.inboxProcedureId),
            )
          }
        />
      </TableSheet>
    </TablePage>
  );
}
