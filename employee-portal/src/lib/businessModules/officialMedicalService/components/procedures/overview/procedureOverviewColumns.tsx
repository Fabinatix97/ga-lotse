/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeeOmsProcedureOverview } from "@eshg/employee-portal-api/officialMedicalService";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { WarningAmberOutlined } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import {
  procedureStatusNames,
  statusColors,
} from "@/lib/shared/components/procedures/constants";

const columnHelper: ColumnHelper<ApiEmployeeOmsProcedureOverview> =
  createColumnHelper<ApiEmployeeOmsProcedureOverview>();

export function procedureOverviewTableColumns() {
  return [
    columnHelper.display({
      id: "highPriority",
      header: "",
      cell: (ctx) =>
        ctx.row.original.concern?.highPriority && (
          <Tooltip
            title={"Dringender Fall"}
            arrow
            placement="top"
            sx={{ marginBottom: -0.5 }}
          >
            <WarningAmberOutlined color="danger" />
          </Tooltip>
        ),
      meta: {
        width: 24,
        cellStyle: "icon",
        headerLabel: "Dringender Fall",
      },
    }),
    columnHelper.accessor("firstName", {
      header: "Vorname",
      cell: (props) => props.getValue(),
      enableSorting: true,
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
      enableSorting: true,
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
      enableSorting: true,
      meta: {
        width: 120,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("facilityName", {
      header: "Auftraggeber",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("physicianName", {
      header: "Ärzt:in",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("status", {
      header: "Vorgang Status",
      cell: (props) => (
        <Chip color={statusColors[props.getValue()]} size="md">
          {procedureStatusNames[props.getValue()]}
        </Chip>
      ),
      enableSorting: true,
      meta: {
        width: 100,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("nextAppointment", {
      header: "Nächster Termin",
      cell: (props) => formatDateTime(props.getValue()),
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];
}
