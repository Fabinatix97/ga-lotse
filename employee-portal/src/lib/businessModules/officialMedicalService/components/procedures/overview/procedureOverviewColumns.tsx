/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeeOmsProcedureOverview } from "@eshg/employee-portal-api/officialMedicalService";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

const columnHelper: ColumnHelper<ApiEmployeeOmsProcedureOverview> =
  createColumnHelper<ApiEmployeeOmsProcedureOverview>();

export function procedureOverviewTableColumns() {
  return [
    columnHelper.accessor("firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      enableSorting: false,
      meta: {
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("lastName", {
      header: "Nachname",
      cell: (props) => props.getValue(),
      enableSorting: false,
      meta: {
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
      enableSorting: false,
      meta: {
        width: 90,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => props.getValue(),
      enableSorting: false,
      meta: {
        width: 100,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];
}
