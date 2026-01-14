/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Stack } from "@mui/joy";

import { optionsFromRecord } from "@eshg/lib-portal";
import { ApiBusinessModule, ApiProcedureType } from "@eshg/lib-procedures-api";

import { buildOptionsFromProcedureTypes } from "../../../utils/mappers";
import { useSidebar } from "../../drawer/hooks/useSidebar";
import { DataTable } from "../../table/components/DataTable";
import { TablePage } from "../../table/components/TablePage";
import { TableSheet } from "../../table/components/TableSheet";
import { Pagination } from "../../table/components/pagination/Pagination";
import { useTableControl } from "../../table/hooks/useTableControl";
import { InboxProcedureClient } from "../api/client";
import { useFetchInboxProcedures } from "../api/queries";
import { statusNames } from "../config/translations";

import { InboxProcedureDetailsSidebar } from "./InboxProcedureDetailsSidebar";
import { CreateProcedureHandler } from "./InboxProceduresPage";
import { MultiSelectFilter } from "./MultiSelectFilter";
import { inboxProcedureColumns } from "./columns";

interface InboxProceduresTableProps {
  inboxProcedureApi: InboxProcedureClient;
  businessModule: ApiBusinessModule;
  procedureTypes: ApiProcedureType[];
  onCreateProcedure?: CreateProcedureHandler;
}

export function InboxProceduresTable(props: InboxProceduresTableProps) {
  const { inboxProcedures, totalElements } = useFetchInboxProcedures(
    props.inboxProcedureApi,
    props.businessModule,
  ).data;

  const detailsSidebar = useSidebar({
    component: InboxProcedureDetailsSidebar,
  });

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
          rowNavigation={{
            onClick: (row) => () =>
              detailsSidebar.open({
                ...props,
                inboxProcedureId: row.original.inboxProcedureId,
              }),
            focusColumnAccessorKey: "inboxProgressEntry.subject",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
