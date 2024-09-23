/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiStiProtectionProcedureOverview } from "@eshg/employee-portal-api/stiProtection";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { EditOutlined } from "@mui/icons-material";
import { createColumnHelper } from "@tanstack/react-table";

import { useTablePageParams } from "@/lib/businessModules/measlesProtection/hooks/useTablePageParams";
import { useStiProceduresQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import {
  CONCERN_VALUES,
  GENDER_VALUES,
  PROCEDURE_STATUS_VALUES,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { Row } from "@/lib/shared/Row";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

export function formatProcedureId(procedureId: string): string {
  return procedureId.length > 8
    ? procedureId.slice(-8).toUpperCase()
    : procedureId;
}

const columnHelper = createColumnHelper<ApiStiProtectionProcedureOverview>();

function getProceduresColumns() {
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
      cell: ({
        row: {
          original: { id: procedureId },
        },
      }) => (
        <Row justifyContent="flex-end">
          <ActionsMenu
            actionItems={[
              {
                label: "Bearbeiten",
                onClick: getLinkToProcedure(procedureId),
                startDecorator: <EditOutlined />,
              },
            ]}
          />
        </Row>
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}

export function StiProtectionProceduresTable() {
  const tablePage = useTablePageParams();
  const {
    data: { procedures, totalElements },
    isLoading,
  } = useStiProceduresQuery(tablePage);

  const tableControl = useTableControl({
    serverSideSorting: false,
    sortFieldName: "sortKey",
  });

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
          columns={getProceduresColumns()}
          rowNavRoute={({ original: { id: procedureId } }) =>
            routes.procedures.byId(procedureId).details
          }
          focusColumnHeader="id"
        />
      </TableSheet>
    </TablePage>
  );
}

function getLinkToProcedure(procedureId: string) {
  return routes.procedures.byId(procedureId).details;
}
