/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  formatDurationFromNowUntil,
  gdprRoutes,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  ApiBusinessModule,
  ApiGdprValidationTask,
  ApiGdprValidationTaskStatus,
  GetAllGdprValidationTasksRequest,
} from "@eshg/lib-procedures-api";

import { formatIdentityName } from "@/lib/baseModule/components/gdpr/helpers";
import { typeTranslation } from "@/lib/baseModule/components/gdpr/i18n";
import { useGdprValidationTaskApi } from "@/lib/shared/api/clients";
import { getGdprValidationTasksQuery } from "@/lib/shared/api/queries/gdpr";

export function ValidationTasksTable({
  request,
  businessModule,
}: Readonly<{
  request: GetAllGdprValidationTasksRequest;
  businessModule: ApiBusinessModule;
}>) {
  const gdprValidationTaskApi = useGdprValidationTaskApi(businessModule);
  const { data, isFetching } = useSuspenseQuery(
    getGdprValidationTasksQuery(gdprValidationTaskApi, businessModule, request),
  );

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
    initialSorting: {
      id: "dueDate",
      desc: false,
    },
  });

  return (
    <TablePage fullHeight data-testid="validation-task-table">
      <TableSheet
        loading={isFetching}
        footer={
          <Pagination
            totalCount={data.totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={data.elements}
          columns={columns}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          rowNavigation={{
            route: (row) =>
              gdprRoutes
                .validationTasks(businessModule)
                .byId(row.original.gdprProcedureId),
            focusColumnAccessorKey: "identificationData",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}

const columnHelper = createColumnHelper<ApiGdprValidationTask>();
const columns = [
  columnHelper.accessor("identificationData", {
    header: "Name",
    enableSorting: false,
    cell: (props) => formatIdentityName(props.getValue()),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("type", {
    header: "Typ",
    enableSorting: false,
    cell: (props) => typeTranslation[props.getValue()],
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("dueDate", {
    header: "Frist",
    enableSorting: true,
    cell: (props) =>
      props.row.original.status === ApiGdprValidationTaskStatus.Open
        ? (formatDurationFromNowUntil(props.getValue()) ?? "Abgelaufen")
        : undefined,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: false,
    cell: (props) => <StatusChip status={props.getValue()} />,
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];

function StatusChip({ status }: { status: ApiGdprValidationTaskStatus }) {
  const open = status === ApiGdprValidationTaskStatus.Open;
  return (
    <Chip variant="soft" color={open ? "neutral" : "success"}>
      {open ? "Offen" : "Abgeschlossen"}
    </Chip>
  );
}
