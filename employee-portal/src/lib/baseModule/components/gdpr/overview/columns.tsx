/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetGdprProcedureResponse } from "@eshg/employee-portal-api/base";
import { InternalLinkIconButton } from "@eshg/lib-portal/components/navigation/InternalLinkIconButton";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { formatPersonName } from "@eshg/lib-portal/formatters/person";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { addMonths } from "date-fns";

import {
  statusTranslation,
  typeTranslation,
} from "@/lib/baseModule/components/gdpr/i18n";
import { routes } from "@/lib/baseModule/shared/routes";
import { formatDurationFromNowUntil } from "@/lib/shared/helpers/dateTime";

// Art. 12 Abs. 3 DSGVO
const gdprMaxDurationMonths = 1;

const columnHelper = createColumnHelper<ApiGetGdprProcedureResponse>();
export const columns = [
  columnHelper.accessor("createdAt", {
    header: "Erstellt",
    enableSorting: true,
    cell: (cell) => formatDateTime(cell.getValue()),
  }),
  columnHelper.accessor("createdAt", {
    id: "dueDate",
    header: "Frist",
    enableSorting: false,
    cell: (cell) =>
      formatDurationFromNowUntil(
        addMonths(cell.getValue(), gdprMaxDurationMonths),
      ) ?? "Abgelaufen",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: false,
    cell: (cell) => statusTranslation[cell.getValue()],
  }),
  columnHelper.accessor("type", {
    header: "Typ",
    enableSorting: false,
    cell: (cell) => typeTranslation[cell.getValue()],
  }),
  columnHelper.accessor("identificationData", {
    header: "Name",
    enableSorting: false,
    cell: (cell) => {
      const value = cell.getValue();
      return value.type === "GdprPerson" ? formatPersonName(value) : value.name;
    },
  }),
  columnHelper.display({
    header: "Aktionen",
    cell: (cell) => (
      <Stack direction="row" justifyContent={"flex-end"}>
        <InternalLinkIconButton
          href={routes.gdpr.details(cell.row.original.id)}
          color={"primary"}
          aria-label={"Details öffnen"}
        >
          <ArrowForwardIosIcon />
        </InternalLinkIconButton>
      </Stack>
    ),
    meta: {
      width: 96,
    },
  }),
];
