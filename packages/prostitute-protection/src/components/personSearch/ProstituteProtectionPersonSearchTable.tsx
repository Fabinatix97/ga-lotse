/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  PERSON_FIELD_NAME,
  formatDate,
  formatWeekdayDateTime,
} from "@eshg/lib-portal";
import {
  ApiConsultationType,
  ApiProcedureStatus,
} from "@eshg/prostitute-protection-api";

import { routes } from "../../config/routes";
import {
  CONSULTATION_TYPE_VALUES,
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_VALUES,
} from "../../shared/constants";

import { ProstituteProtectionPersonSearch } from "./ProstituteProtectionPersonSearch";

interface PersonSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  alias?: string;
  dateOfBirth: Date;
  consultationType?: ApiConsultationType;
  appointmentStart?: Date;
  status: ApiProcedureStatus;
}

const initialSorting: ColumnSort = {
  id: "firstName",
  desc: false,
};

const columnHelper = createColumnHelper<PersonSearchResult>();

const mockData: PersonSearchResult[] = [
  {
    id: "1",
    firstName: "Anastasia",
    lastName: "Nowaka",
    alias: "Minnie Maus",
    dateOfBirth: new Date("1985-04-24"),
    consultationType: ApiConsultationType.Initial,
    appointmentStart: new Date("2025-11-09T11:20:00"),
    status: ApiProcedureStatus.Open,
  },
  {
    id: "2",
    firstName: "Anastasia",
    lastName: "Nowaka",
    alias: "Minnie Maus",
    dateOfBirth: new Date("1985-04-24"),
    consultationType: ApiConsultationType.FollowUp,
    appointmentStart: new Date("2025-10-30T10:30:00"),
    status: ApiProcedureStatus.Aborted,
  },
  {
    id: "3",
    firstName: "Anastasia",
    lastName: "Nowaka",
    alias: "Minnie Maus",
    dateOfBirth: new Date("1985-04-24"),
    consultationType: ApiConsultationType.Initial,
    appointmentStart: new Date("2024-12-01T10:30:00"),
    status: ApiProcedureStatus.Closed,
  },
];

function getProceduresColumns() {
  return [
    columnHelper.accessor("firstName", {
      header: PERSON_FIELD_NAME.firstName,
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("lastName", {
      header: PERSON_FIELD_NAME.lastName,
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("alias", {
      header: "Alias",
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: PERSON_FIELD_NAME.dateOfBirth,
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("consultationType", {
      header: "Beratungstyp",
      cell: ({ getValue }) => {
        const key = getValue();
        return key ? CONSULTATION_TYPE_VALUES[key] : null;
      },
      enableSorting: false,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) => formatWeekdayDateTime(getValue()),
      enableSorting: true,
      meta: { width: 200, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <Chip color={PROCEDURE_STATUS_COLORS[getValue()]}>
          {PROCEDURE_STATUS_VALUES[getValue()]}
        </Chip>
      ),
      enableSorting: false,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
  ];
}

export function ProstituteProtectionPersonSearchTable() {
  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
  });

  return (
    <TablePage
      data-testid="personSearchTable"
      aria-label="Personensuche"
      controls={
        <ProstituteProtectionPersonSearch
          onChange={(v) => {
            // eslint-disable-next-line no-console
            console.log("changed", v);
          }}
        />
      }
      fullHeight
    >
      <TableSheet
        loading={false}
        footer={
          <Pagination
            totalCount={mockData.length}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={mockData}
          columns={getProceduresColumns()}
          rowNavigation={{
            route: ({ original: { id: procedureId } }) =>
              routes.procedures.byId(procedureId).details,
            focusColumnAccessorKey: "appointmentStart",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
