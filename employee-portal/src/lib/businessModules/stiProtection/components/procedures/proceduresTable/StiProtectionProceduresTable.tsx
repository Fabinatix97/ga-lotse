/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, EditOutlined, ToggleOffOutlined } from "@mui/icons-material";
import { Button, Chip } from "@mui/joy";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { useReducer, useState } from "react";

import {
  ActionsMenu,
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { Row } from "@eshg/lib-portal/components/Row";
import { GENDER_VALUES } from "@eshg/lib-portal/components/formFields/constants";
import { NavigationLink } from "@eshg/lib-portal/components/navigation/NavigationLink";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { ApiStiProtectionProcedureOverview } from "@eshg/sti-protection-api";

import { useGetStiProceduresTablePage } from "@/lib/businessModules/stiProtection/api/queries/procedures";
import { DisplayAccessCode } from "@/lib/businessModules/stiProtection/features/procedures/DisplayAccessCode";
import {
  ReopenConfirmationDialog,
  UseCloseAndReopenConfirmationDialog,
  useCloseAndReopenProcedure,
} from "@/lib/businessModules/stiProtection/features/procedures/details/CloseAndReopenDialogs";
import {
  CONCERN_VALUES,
  LAB_STATUS_COLORS,
  LAB_STATUS_VALUES,
  PROCEDURE_ORIGIN_VALUES,
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_VALUES,
} from "@/lib/businessModules/stiProtection/shared/constants";
import { isProcedureOpen } from "@/lib/businessModules/stiProtection/shared/helpers";
import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import {
  ProceduresTableControls,
  TableControlName,
  reduceActiveTableControl,
} from "@/lib/shared/components/tableControls/ProceduresTableControls";
import { useSearchParamLink } from "@/lib/shared/hooks/searchParams/useSearchParam";

import {
  StiProtectionProceduresTableFilterButton,
  StiProtectionProceduresTableFilters,
  useProceduresFilterState,
  useProceduresFilters,
} from "./StiProtectionProceduresTableFilters";

const initialSorting: ColumnSort = {
  id: "createdAt",
  desc: true,
};

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
        width: 120,
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
        width: 134,
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
        width: 134,
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
        width: 144,
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
        width: 180,
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
        width: 100,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("sampleBarCode", {
      header: "Labor-Barcode",
      cell: ({ getValue }) => (
        <Row component="span" aria-label={getValue()} fontFamily="code">
          <span>{getValue()}</span>
        </Row>
      ),
      enableSorting: true,
      meta: {
        width: 172,
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
        width: 145,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("procedureOrigin", {
      header: "Ursprung",
      cell: ({ getValue }) => PROCEDURE_ORIGIN_VALUES[getValue()],
      enableSorting: false,
      meta: {
        width: 100,
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
  const { setFilterSettingsVisible } = useProceduresFilterState();
  const filters = useProceduresFilters();
  const openNewProcedureSidebarLink = useSearchParamLink("add-procedure", true);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeTableControl, toggleActiveTableControl] = useReducer(
    reduceActiveTableControl,
    undefined,
  );
  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
  });

  const {
    stiProceduresData: { procedures: stiProcedures, totalElements },
    isLoading,
  } = useGetStiProceduresTablePage({
    filters,
    page: tableControl.paginationProps,
    sorting: tableControl.tableSorting,
    searchQuery,
  });

  const reopenDialog = useCloseAndReopenProcedure();

  function handleToggleActiveTableControl(tableControl: TableControlName) {
    toggleActiveTableControl(tableControl);

    if (tableControl === "entrySearch") setFilterSettingsVisible(false);
  }

  return (
    <TablePage
      aria-label="Vorgänge"
      filterSettings={<StiProtectionProceduresTableFilters />}
      controls={
        <ProceduresTableControls
          onEntrySearch={setSearchQuery}
          onToggleActiveTableControl={handleToggleActiveTableControl}
          activeTableControl={activeTableControl}
          ToggleFilterButton={<StiProtectionProceduresTableFilterButton />}
          controlsRight={
            <NavigationLink href={openNewProcedureSidebarLink} passHref>
              <Button startDecorator={<Add />}>Neuen Vorgang anlegen</Button>
            </NavigationLink>
          }
        />
      }
    >
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
          data={stiProcedures}
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
