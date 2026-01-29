/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import {
  DataTable,
  Pagination,
  PersonSearchForm,
  TablePage,
  TableSheet,
  usePersonSearch,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  PERSON_FIELD_NAME,
  formatDate,
  formatDateTime,
  useNavigation,
} from "@eshg/lib-portal";
import {
  ApiConsultationType,
  ApiProcedureStatus,
} from "@eshg/prostitute-protection-api";

import { usePersonSearchOptions } from "../../api/queries/person";
import { routes } from "../../config/routes";
import { useDecryptedPersons } from "../../contexts/decryptedPersons/DecryptedPersonsStoreProvider";
import {
  CONSULTATION_TYPE_VALUES,
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_VALUES,
} from "../../shared/constants";

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
  id: "appointmentStart",
  desc: false,
};

const columnHelper = createColumnHelper<PersonSearchResult>();

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
      cell: ({ getValue }) => formatDateTime(getValue()),
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
  const { formValues, ...personSearch } = usePersonSearch();
  const { addDecryptedPerson } = useDecryptedPersons();
  const { tryNavigate } = useNavigation();

  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
  });

  const personSearchOptions = usePersonSearchOptions({
    search: {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dateOfBirth: new Date(formValues.dateOfBirth),
    },
    page: tableControl.paginationProps,
    sorting: tableControl.tableSorting,
  });

  const { data, refetch: getPersons } = useQuery(personSearchOptions);

  return (
    <TablePage
      data-testid="person-search-table"
      aria-label="Personensuche"
      controls={
        <PersonSearchForm
          {...personSearch.formProps}
          autoFocus
          onChange={async (v) => {
            personSearch.setValues(v);
            await getPersons();
          }}
        />
      }
      fullHeight
    >
      <TableSheet
        loading={false}
        footer={
          <Pagination
            totalCount={data?.totalNumberOfElements ?? 0}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={data?.elements ?? []}
          columns={getProceduresColumns()}
          rowNavigation={{
            onClick: (row) => () => {
              addDecryptedPerson(row.original);
              tryNavigate(routes.procedures.byId(row.original.id).details);
            },
            focusColumnAccessorKey: "appointmentStart",
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
