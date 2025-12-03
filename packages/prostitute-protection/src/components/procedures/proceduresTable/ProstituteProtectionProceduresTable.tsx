/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";
import { isNullish } from "remeda";

import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { formatWeekdayDateTime } from "@eshg/lib-portal";
import { ApiProstituteProtectionProcedureOverview } from "@eshg/prostitute-protection-api";

import { useProceduresQueryOptions } from "../../../api/queries/procedures";
import { routes } from "../../../config/routes";
import {
  CONSULTATION_TYPE_VALUES,
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_VALUES,
} from "../../../shared/constants";

import { LanguagesCell } from "./LanguagesCell";
import { ProstituteProtectionProceduresTableControls } from "./ProstituteProtectionProceduresTableControls";

const initialSorting: ColumnSort = {
  id: "appointmentStart",
  desc: false,
};

const columnHelper =
  createColumnHelper<ApiProstituteProtectionProcedureOverview>();

function getProceduresColumns() {
  return [
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) =>
        isNullish(getValue()) ? "" : `${formatWeekdayDateTime(getValue())} Uhr`,
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("alias", {
      header: "Alias",
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
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
        width: 160,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("languages", {
      header: "Sprachen",
      cell: ({ getValue }) => <LanguagesCell languages={getValue()} />,
      enableSorting: false,
      meta: {
        width: 160,
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
        width: 160,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];
}

export function ProstituteProtectionProceduresTable() {
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

  const {
    data: { elements, totalNumberOfElements },
    isLoading,
  } = useSuspenseQuery(proceduresQueryOptions);

  return (
    <TablePage
      data-testid="procedureTable"
      aria-label="Vorgänge"
      controls={<ProstituteProtectionProceduresTableControls />}
      filterSettings={null}
      search={null}
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
          data={elements}
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
