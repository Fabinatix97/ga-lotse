/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { ApiWaitingRoomProcedure } from "@eshg/official-medical-service-api";
import { Chip } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { statusColorsWaitingStatus } from "@/lib/businessModules/officialMedicalService/shared/constants";
import { WAITING_STATUS_VALUES } from "@/lib/businessModules/officialMedicalService/shared/translations";
import { formatDateTimeRangeToNow } from "@/lib/shared/helpers/dateTime";

const columnHelper: ColumnHelper<ApiWaitingRoomProcedure> =
  createColumnHelper<ApiWaitingRoomProcedure>();

export function waitingRoomColumns() {
  return [
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
        width: 160,
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
        width: 250,
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
        width: 180,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("waitingRoom.status", {
      header: "Wartezimmer Status",
      cell: (props) => (
        <Chip color={statusColorsWaitingStatus[props.getValue()!]} size="md">
          {WAITING_STATUS_VALUES[props.getValue()!]}
        </Chip>
      ),
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("waitingRoom.info", {
      header: "Info",
      cell: (props) => props.getValue(),
      enableSorting: true,
      meta: {
        width: 200,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("modifiedAt", {
      header: "Seit",
      cell: (props) => formatDateTimeRangeToNow(props.getValue()),
      enableSorting: true,
      meta: {
        width: 120,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];
}
