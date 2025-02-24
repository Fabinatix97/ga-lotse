/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Row } from "@eshg/lib-portal/components/Row";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { ApiBusinessModule } from "@eshg/lib-procedures-api";
import { ApiStiProtectionProcedureOverview } from "@eshg/sti-protection-api";
import { EditOutlined, ToggleOffOutlined } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { useStiProceduresQuery } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { DisplayAccessCode } from "@/lib/businessModules/stiProtection/features/procedures/DisplayAccessCode";
import {
  ReopenConfirmationDialog,
  UseCloseAndReopenConfirmationDialog,
  useCloseAndReopenProcedure,
} from "@/lib/businessModules/stiProtection/features/procedures/details/CloseAndReopenDialogs";
import {
  CONCERN_VALUES,
  GENDER_VALUES,
  LAB_STATUS_COLORS,
  LAB_STATUS_VALUES,
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_VALUES,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { useGetGdprValidationBannerQuery } from "@/lib/shared/api/queries/gdpr";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { useGdprValidationTasksAlert } from "@/lib/shared/components/gdpr/useGdprValidationTasksAlert";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useTableControl } from "@/lib/shared/hooks/searchParams/useTableControl";

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
    columnHelper.accessor("accessCode", {
      header: "Anmeldecode",
      cell: (props) => <DisplayAccessCode code={props.getValue()} />,
      enableSorting: false,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("yearOfBirth", {
      header: "Geburtsjahr",
      cell: ({ getValue }) => getValue(),
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("gender", {
      header: "Geschlecht",
      cell: ({ getValue }) => GENDER_VALUES[getValue()],
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <Chip color={PROCEDURE_STATUS_COLORS[getValue()]}>
          {PROCEDURE_STATUS_VALUES[getValue()]}
        </Chip>
      ),
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) => formatDateTime(getValue()),
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
      enableSorting: false,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt",
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("sampleBarCode", {
      header: "Labor-Barcode",
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("labStatus", {
      header: "Laborstatus",
      cell: ({ getValue }) => (
        <Chip color={LAB_STATUS_COLORS[getValue()]}>
          {LAB_STATUS_VALUES[getValue()]}
        </Chip>
      ),
      enableSorting: false,
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
  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
  });

  const proceduresQuery = useStiProceduresQuery(
    tableControl.paginationProps,
    tableControl.tableSorting,
  );
  const gdprBannerQuery = useGetGdprValidationBannerQuery(
    ApiBusinessModule.StiProtection,
  );

  const [
    {
      data: { procedures, totalElements },
      isLoading,
    },
    gdprBanner,
  ] = useSuspenseQueries({
    queries: [proceduresQuery, gdprBannerQuery],
  });

  useGdprValidationTasksAlert({
    banner: gdprBanner.data,
    businessModule: ApiBusinessModule.StiProtection,
  });

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
          rowNavigation={{
            route: ({ original: { id: procedureId } }) =>
              routes.procedures.byId(procedureId).details,
            focusColumnAccessorKey: "createdAt",
          }}
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
