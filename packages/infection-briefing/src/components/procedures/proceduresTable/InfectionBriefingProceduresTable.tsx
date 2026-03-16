/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { DeleteOutline } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useId } from "react";

import {
  ApiInfectionBriefingProcedure,
  ApiProcedureStatus,
} from "@eshg/infection-briefing-api";
import {
  DataTable,
  IconButton,
  Pagination,
  PersonSearchForm,
  TablePage,
  TableSheet,
  usePersonSearchFromURL,
  useSearchParam,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { Row, formatDate, formatDateTime, ifDefined } from "@eshg/lib-portal";

import { useProceduresQueryOptions } from "../../../api/queries/procedures";
import {
  INSTRUCTION_TYPE_VALUES,
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_VALUES,
  PROCEDURE_TYPE_VALUES,
} from "../../../shared/constants";

import {
  InfectionBriefingProceduresTableControls,
  TableControlName,
} from "./InfectionBriefingProceduresTableControls";
import { InfectionBriefingProceduresTableFilterPreselectionWrapper } from "./InfectionBriefingProceduresTableFilterPreselectionWrapper";
import {
  ACTIVE_PANEL_NAME,
  InfectionBriefingProceduresTableFilters,
  useProceduresFilters,
} from "./InfectionBriefingProceduresTableFilters";

const columnHelper = createColumnHelper<ApiInfectionBriefingProcedure>();

interface RowActions {
  onAbortProcedure: (id: string) => void;
}

function getProceduresColumns({ onAbortProcedure }: RowActions) {
  return [
    columnHelper.accessor("firstName", {
      header: "Vorname",
      cell: ({ getValue }) => getValue(),
      enableSorting: false,
      meta: {
        width: 110,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("lastName", {
      header: "Name",
      cell: ({ getValue }) => getValue(),
      enableSorting: false,
      meta: {
        width: 110,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: false,
      meta: {
        width: 80,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("instructionDate", {
      header: "Datum der Belehrung",
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: false,
      meta: {
        width: 160,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("appointmentTime", {
      header: "Termin",
      cell: ({ getValue }) => formatDateTime(getValue()),
      enableSorting: false,
      meta: {
        width: 160,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("instructionType", {
      header: "Terminformat",
      cell: ({ getValue }) =>
        ifDefined(getValue(), (v) => INSTRUCTION_TYPE_VALUES[v]),
      enableSorting: false,
      meta: {
        width: 160,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("procedureType", {
      header: "Terminart",
      cell: ({ getValue }) => PROCEDURE_TYPE_VALUES[getValue()],
      enableSorting: false,
      meta: {
        width: 160,
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
        width: 80,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: ({ row: { original: procedure } }) =>
        procedure.status === ApiProcedureStatus.Draft && (
          <Row justifyContent="flex-end">
            <IconButton
              variant="plain"
              label="Löschen"
              onClick={() => {
                onAbortProcedure(procedure.procedureId);
              }}
            >
              <DeleteOutline />
            </IconButton>
          </Row>
        ),
      meta: {
        cellStyle: "button",
        width: 90,
        textAlign: "right",
      },
    }),
  ];
}

const TABLE_CONTROL_NAMES: TableControlName[] = ["filters", "personSearch"];
export function useActivePanelName() {
  const [state, setState] = useSearchParam(ACTIVE_PANEL_NAME, "string");
  return [
    TABLE_CONTROL_NAMES.includes(state as TableControlName)
      ? (state as TableControlName)
      : null,
    setState as (v: TableControlName | null) => void,
  ] as const;
}

export function InfectionBriefingProceduresTable() {
  const personSearch = usePersonSearchFromURL();
  const filtersPanelId = useId();
  const filters = useProceduresFilters();

  const [activeTableControl, setActiveTableName] = useActivePanelName();
  function toggleActiveTableControl(name: TableControlName) {
    if (activeTableControl === name) {
      setActiveTableName(null);
      return;
    }
    setActiveTableName(name);
  }

  const tableControl = useTableControl({
    serverSideSorting: true,
  });

  const proceduresQueryOptions = useProceduresQueryOptions({
    filters,
    page: tableControl.paginationProps,
    search: personSearch.searchParams,
  });

  const [proceduresResults] = useSuspenseQueries({
    queries: [proceduresQueryOptions],
  });
  const {
    data: { elements: infectionBriefingProcedures, totalNumberOfElements },
    isLoading,
  } = proceduresResults;

  return (
    <TablePage
      data-testid="procedureTable"
      aria-label="Vorgänge"
      controls={
        <InfectionBriefingProceduresTableControls
          activeTableControl={activeTableControl}
          filtersPanelId={filtersPanelId}
          onToggleActiveTableControl={toggleActiveTableControl}
        />
      }
      filterSettings={
        <InfectionBriefingProceduresTableFilterPreselectionWrapper>
          <InfectionBriefingProceduresTableFilters
            filtersPanelId={filtersPanelId}
          />
        </InfectionBriefingProceduresTableFilterPreselectionWrapper>
      }
      search={
        <PersonSearchForm
          isHidden={activeTableControl !== "personSearch"}
          {...personSearch.formProps}
          allowPartialSearch
          onChange={(v) => {
            personSearch.setValues(v);
          }}
        />
      }
      fullHeight
    >
      <TableSheet
        loading={isLoading}
        footer={
          <Pagination
            totalCount={totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={infectionBriefingProcedures}
          sorting={tableControl.tableSorting}
          enableSortingRemoval={false}
          columns={getProceduresColumns({
            onAbortProcedure: (id) => {
              throw new Error(
                `Not implemented yet! Procedure ${id} was not deleted.`,
              );
            },
          })}
          rowNavigation={{
            route: ({}) => {
              return "Navigation-not-implemented-yet";
            },
            focusColumnAccessorKey: "firstName",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
