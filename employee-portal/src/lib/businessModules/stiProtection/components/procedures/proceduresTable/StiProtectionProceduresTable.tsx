/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiStiProtectionProcedureOverview } from "@eshg/employee-portal-api/stiProtection";
import { Row } from "@eshg/lib-portal/components/Row";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { EditOutlined, ToggleOffOutlined } from "@mui/icons-material";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { useStiProceduresQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import {
  ReopenConfirmationDialog,
  UseCloseAndReopenConfirmationDialog,
  useCloseAndReopenProcedure,
} from "@/lib/businessModules/stiProtection/features/procedures/details/CloseAndReopenDialogs";
import {
  CONCERN_VALUES,
  GENDER_VALUES,
  PROCEDURE_STATUS_VALUES,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";
import { useTablePageParams } from "@/lib/shared/hooks/useTablePageParams";

const initialSorting: ColumnSort = {
  id: "createdAt",
  desc: true,
};

export function formatProcedureId(procedureId: string): string {
  return procedureId.length > 8
    ? procedureId.slice(-8).toUpperCase()
    : procedureId;
}

const columnHelper = createColumnHelper<ApiStiProtectionProcedureOverview>();

function getProceduresColumns({
  reopenDialog,
}: {
  reopenDialog: UseCloseAndReopenConfirmationDialog;
}) {
  return [
    columnHelper.accessor("yearOfBirth", {
      header: "Geburtsjahr",
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("gender", {
      header: "Geschlecht",
      cell: ({ getValue }) => GENDER_VALUES[getValue()],
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => PROCEDURE_STATUS_VALUES[getValue()],
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("concern", {
      header: "Anliegen",
      cell: ({ getValue }) => CONCERN_VALUES[getValue()],
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstell.",
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: ({ row: { original: procedure } }) => (
        <Row justifyContent="flex-end">
          <ActionsMenu
            actionItems={
              isProcedureOpen(procedure)
                ? openActions(procedure.id)
                : closedActions({ procedure, reopenDialog })
            }
          />
        </Row>
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}

type ColumnNames = keyof ApiStiProtectionProcedureOverview;

function mapTableFieldToSortField(sortBy?: ColumnNames) {
  if (!sortBy) return;

  switch (sortBy) {
    case "yearOfBirth":
      return "YEAR_OF_BIRTH";
    case "gender":
      return "GENDER";
    case "status":
      return "STATUS";
    case "concern":
      return "CONCERN";
    case "createdAt":
      return "CREATED_AT";
    default:
      throw Error(`Unexpected sort field: ${sortBy}`);
  }
}

function openActions(procedureId: string) {
  return [
    {
      label: "Bearbeiten",
      onClick: getLinkToProcedure(procedureId),
      startDecorator: <EditOutlined />,
    },
  ];
}

function closedActions({
  procedure,
  reopenDialog,
}: {
  procedure: ApiStiProtectionProcedureOverview;
  reopenDialog: UseCloseAndReopenConfirmationDialog;
}) {
  return [
    {
      label: "Wiedereröffnen",
      onClick: () => reopenDialog.requestFinalize(procedure),
      startDecorator: <ToggleOffOutlined />,
    },
  ];
}

export function StiProtectionProceduresTable() {
  const fieldNames = {
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
  };
  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    ...fieldNames,
  });

  const tablePage = useTablePageParams<ColumnNames>({
    fieldNames,
    mapColumnNames: mapTableFieldToSortField,
  });
  const {
    data: { procedures, totalElements },
    isLoading,
  } = useStiProceduresQuery(tablePage);

  const reopenDialog = useCloseAndReopenProcedure();

  return (
    <TablePage aria-label="Vorgänge">
      <TableSheet
        loading={isLoading}
        footer={
          <Pagination
            totalCount={totalElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={procedures}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          columns={getProceduresColumns({ reopenDialog })}
          rowNavRoute={({ original: { id: procedureId } }) =>
            routes.procedures.byId(procedureId).details
          }
          focusColumnHeader="id"
        />
        <ReopenConfirmationDialog
          open={reopenDialog.isRequestingFinalize}
          onClose={reopenDialog.abortFinalize}
          onConfirm={reopenDialog.handleFinalizeProcedure}
          procedure={reopenDialog.procedure}
        />
      </TableSheet>
    </TablePage>
  );
}

function getLinkToProcedure(procedureId: string) {
  return routes.procedures.byId(procedureId).details;
}
