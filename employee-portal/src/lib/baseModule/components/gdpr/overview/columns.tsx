/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetGdprProcedureResponse } from "@eshg/employee-portal-api/base";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import { Chip } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { addMonths } from "date-fns";

import { gdprProcedureStatusColor } from "@/lib/baseModule/components/gdpr/constants";
import {
  statusTranslation,
  typeTranslation,
} from "@/lib/baseModule/components/gdpr/i18n";
import { formatDurationFromNowUntil } from "@/lib/shared/helpers/dateTime";

// Art. 12 Abs. 3 DSGVO
const gdprMaxDurationMonths = 1;

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
    enableSorting: false,
    cell: (cell) =>
      formatDurationFromNowUntil(
        addMonths(cell.getValue(), gdprMaxDurationMonths),
      ) ?? "Abgelaufen",
    meta: {
      width: "20ch",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Erstellt",
    enableSorting: true,
    cell: (cell) => formatDateTime(cell.getValue()),
    meta: {
      width: "20rem",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
];
