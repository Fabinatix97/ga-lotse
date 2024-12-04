/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeeOmsProcedureOverview } from "@eshg/employee-portal-api/officialMedicalService";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

const columnHelper: ColumnHelper<ApiEmployeeOmsProcedureOverview> =
  createColumnHelper<ApiEmployeeOmsProcedureOverview>();

export function procedureOverviewTableColumns() {
  return [
    columnHelper.accessor("id", {
      header: "Id",
      cell: (props) => props.getValue(),
      enableSorting: false,
      meta: {
        width: 350,
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
