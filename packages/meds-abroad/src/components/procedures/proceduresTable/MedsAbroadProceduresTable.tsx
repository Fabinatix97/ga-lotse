/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { EditOutlined } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { useReducer } from "react";

import {
  ActionsMenu,
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { Row, formatDate, formatDateTime } from "@eshg/lib-portal";
import { ApiMedsAbroadProcedure } from "@eshg/meds-abroad-api";

import { useGetMedsAbroadProceduresTablePage } from "../../../api/queries/procedures";
import {
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_VALUES,
} from "../../../shared/constants";
import { isProcedureOpen } from "../../../shared/helpers";
import { routes } from "../../../shared/routes";

import {
  MedsAbroadProceduresTableControls,
  TableControlName,
  reduceActiveTableControl,
} from "./MedsAbroadProceduresTableControls";
import {
  MedsAbroadProceduresTableFilterButton,
  MedsAbroadProceduresTableFilters,
  useProceduresFilterState,
  useProceduresFilters,
} from "./MedsAbroadProceduresTableFilters";

const initialSorting: ColumnSort = {
  id: "createdAt",
  desc: true,
};

const columnHelper = createColumnHelper<ApiMedsAbroadProcedure>();

function getProceduresColumns() {
  return [
    columnHelper.accessor("person.firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: { width: 180, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("person.lastName", {
      header: "Nachname",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: { width: 180, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("person.dateOfBirth", {
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
      enableSorting: true,
      meta: { width: 155, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("procedureStatus", {
      header: "Status",
      cell: ({ getValue }) => (
        <Chip color={PROCEDURE_STATUS_COLORS[getValue()]}>
          {PROCEDURE_STATUS_VALUES[getValue()]}
        </Chip>
      ),
      enableSorting: false,
      meta: { width: 134, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) => formatDateTime(getValue()),
      enableSorting: false,
      meta: { width: 144, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("certificatePaid", {
      header: "Bezahlt",
      cell: ({ getValue }) => (getValue() ? "Ja" : "Nein"),
      enableSorting: false,
      meta: { width: 145, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("createdAt", {
      header: "Erstellt",
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: true,
      meta: { width: 100, canNavigate: { parentRow: true } },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: ({ row: { original: procedure } }) => (
        <Row justifyContent="flex-end">
          <ActionsMenu
            actionItems={
              isProcedureOpen(procedure) ? openActions(procedure.id) : []
            }
          />
        </Row>
      ),
      meta: { width: 96 },
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

export function MedsAbroadProceduresTable() {
  const { setFilterSettingsVisible } = useProceduresFilterState();
  const filters = useProceduresFilters();

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
    medsAbroadProceduresData: {
      procedures: medsAbroadProcedures,
      totalElements,
    },
    isLoading,
  } = useGetMedsAbroadProceduresTablePage({
    filters,
    page: tableControl.paginationProps,
    sorting: tableControl.tableSorting,
  });

  function handleToggleActiveTableControl(tableControl: TableControlName) {
    toggleActiveTableControl(tableControl);

    if (tableControl === "personSearch") setFilterSettingsVisible(false);
  }

  return (
    <TablePage
      aria-label="Vorgänge"
      filterSettings={<MedsAbroadProceduresTableFilters />}
      controls={
        <MedsAbroadProceduresTableControls
          activeTableControl={activeTableControl}
          ToggleFilterButton={<MedsAbroadProceduresTableFilterButton />}
          onToggleActiveTableControl={handleToggleActiveTableControl}
        />
      }
      fullHeight
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
          data={medsAbroadProcedures}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          columns={getProceduresColumns()}
          rowNavigation={{
            route: ({ original: { id: procedureId } }) =>
              routes.procedures.byId(procedureId).details,
            focusColumnAccessorKey: "createdAt",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}

function getLinkToProcedure(procedureId: string) {
  return routes.procedures.byId(procedureId).details;
}
