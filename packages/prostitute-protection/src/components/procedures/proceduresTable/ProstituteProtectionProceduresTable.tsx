/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import {
  DataTable,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { formatDate, formatDateTime } from "@eshg/lib-portal";
import { ApiProstituteProtectionProcedureOverview } from "@eshg/prostitute-protection-api";

import { useProceduresQueryOptions } from "../../../api/queries/procedures";
import { CONSULTATION_TYPE_VALUES } from "../../../shared/constants";

import { LanguagesCell } from "./LanguagesCell";
import { PersonSearchForm, usePersonSearch } from "./PersonSearchForm";
import { ProstituteProtectionProceduresTableControls } from "./ProstituteProtectionProceduresTableControls";

const initialSorting: ColumnSort = {
  id: "appointmentStart",
  desc: true,
};

const columnHelper =
  createColumnHelper<ApiProstituteProtectionProcedureOverview>();

function getProceduresColumns() {
  return [
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) => formatDateTime(getValue()),
      enableSorting: true,
      meta: {
        width: 160,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("lastName", {
      header: "Nachname",
      cell: ({ getValue }) => getValue(),
      enableSorting: false,
      meta: {
        width: 110,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
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
    columnHelper.accessor("alias", {
      header: "Alias",
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
    columnHelper.accessor("status", {
      header: "Status",
      cell: () => <Chip color="neutral">Offen</Chip>,
      enableSorting: false,
      meta: {
        width: 80,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("languages", {
      header: "Weitere Sprachen",
      cell: ({ getValue }) => <LanguagesCell languages={getValue()} />,
      enableSorting: false,
      meta: {
        width: 100,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("consultationType", {
      header: "Art der Konsultation",
      cell: ({ getValue }) => {
        const consultationKey = getValue();
        if (!consultationKey) {
          return null;
        }
        return CONSULTATION_TYPE_VALUES[consultationKey];
      },
      enableSorting: false,
      meta: {
        width: 110,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];
}

export function ProstituteProtectionProceduresTable() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const personSearch = usePersonSearch();

  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
  });

  const proceduresQueryOptions = useProceduresQueryOptions({
    page: tableControl.paginationProps,
    sorting: tableControl.tableSorting,
  });

  const { data, isLoading } = useSuspenseQuery(proceduresQueryOptions);

  return (
    <TablePage
      aria-label="Vorgänge"
      controls={
        <ProstituteProtectionProceduresTableControls
          handleSearch={() => setSearchVisible(!isSearchVisible)}
          isSearchVisible={!isSearchVisible}
        />
      }
      filterSettings={null}
      search={
        <PersonSearchForm
          isHidden={!isSearchVisible}
          {...personSearch.formProps}
          onChange={(v) => {
            personSearch.setValues(v);
          }}
        />
      }
      fullHeight
    >
      <TableSheet loading={isLoading}>
        <DataTable data={data.elements} columns={getProceduresColumns()} />
      </TableSheet>
    </TablePage>
  );
}
