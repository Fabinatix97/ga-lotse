/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";
import { CellContext, createColumnHelper } from "@tanstack/react-table";
import { addMonths } from "date-fns";

import {
  ApiGdprProcedureStatus,
  ApiGetGdprProcedureResponse,
} from "@eshg/base-api";
import { formatDurationFromNowUntil } from "@eshg/lib-employee-portal";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";

import { gdprProcedureStatusColor } from "@/lib/baseModule/components/gdpr/constants";
import {
  statusTranslation,
  typeTranslation,
} from "@/lib/baseModule/components/gdpr/i18n";

const columnHelper = createColumnHelper<ApiGetGdprProcedureResponse>();
export const columns = [
  columnHelper.accessor("identificationData", {
    header: "Name",
    enableSorting: false,
    cell: (cell) => {
      const value = cell.getValue();
      return value.type === "GdprPerson" ? formatPersonName(value) : value.name;
    },
    meta: {
      width: "20rem",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("type", {
    header: "Typ",
    enableSorting: false,
    cell: (cell) => typeTranslation[cell.getValue()],
    meta: {
      width: "20ch",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: false,
    cell: (cell) => (
      <Chip color={gdprProcedureStatusColor[cell.getValue()]}>
        {statusTranslation[cell.getValue()]}
      </Chip>
    ),
    meta: {
      width: "15rem",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("createdAt", {
    id: "dueDate",
    header: "Frist",
    enableSorting: true,
    cell: (cell) => dueDate(cell),
    meta: {
      width: "20ch",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Erstellt",
    enableSorting: false,
    cell: (cell) => formatDateTime(cell.getValue()),
    meta: {
      width: "20rem",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];

// Art. 12 Abs. 3 DSGVO
const gdprMaxDurationMonths = 1;

const closedStatus: ApiGdprProcedureStatus[] = [
  ApiGdprProcedureStatus.Closed,
  ApiGdprProcedureStatus.Aborted,
];

function dueDate(cell: CellContext<ApiGetGdprProcedureResponse, Date>) {
  if (closedStatus.includes(cell.row.original.status)) {
    return null;
  }

  return (
    formatDurationFromNowUntil(
      addMonths(cell.getValue(), gdprMaxDurationMonths),
    ) ?? "Abgelaufen"
  );
}
