/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  useSidebar,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { ApiProcedureType } from "@eshg/lib-procedures-api";
import { Stack } from "@mui/joy";

import {
  UseFetchInboxProcedure,
  UseFetchInboxProcedures,
} from "@/lib/shared/api/queries/inboxProcedures";
import { buildOptionsFromProcedureTypes } from "@/lib/shared/components/procedures/helper";
import { InboxProcedureDetailsSidebar } from "@/lib/shared/components/procedures/inbox/InboxProcedureDetailsSidebar";
import { UseCreateInboxProcedure } from "@/lib/shared/components/procedures/inbox/hooks/useCreateInboxProcedureStatusTemplate";
import { UseCloseInboxProcedure } from "@/lib/shared/components/procedures/inbox/mutations/useCloseInboxProcedureStatusTemplate";
import { MultiSelectFilter } from "@/lib/shared/components/tableFilters/MultiSelectFilter";

import { inboxProcedureColumns } from "./columns";
import { statusNames } from "./constants";

interface InboxProceduresTableProps {
  procedureTypes: ApiProcedureType[];
  useFetchInboxProcedures: UseFetchInboxProcedures;
  useFetchInboxProcedure: UseFetchInboxProcedure;
  useCloseInboxProcedure: UseCloseInboxProcedure;
  useCreateInboxProcedure?: UseCreateInboxProcedure;
}

export function InboxProceduresTable(props: InboxProceduresTableProps) {
  const { inboxProcedures, totalElements } =
    props.useFetchInboxProcedures().data;

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
