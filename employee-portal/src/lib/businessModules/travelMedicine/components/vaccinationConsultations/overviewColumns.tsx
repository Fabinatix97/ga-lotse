/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentBookingType,
  ApiAppointmentOverviewEntry,
} from "@eshg/employee-portal-api/travelMedicine";
import {
  formatDate,
  formatDateTime,
} from "@eshg/lib-portal/formatters/dateTime";
import { Chip } from "@mui/joy";
import {
  ColumnHelper,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";

import {
  translateAppointmentType,
  translateCreatedByUserType,
} from "@/lib/businessModules/travelMedicine/components/appointmentTypes/translations";
import {
  procedureStatusNames,
  statusColors,
} from "@/lib/shared/components/procedures/constants";

const columnHelper: ColumnHelper<ApiAppointmentOverviewEntry> =
  createColumnHelper<ApiAppointmentOverviewEntry>();

function formatBookingType(bookingType: ApiAppointmentBookingType | undefined) {
  if (
    bookingType === ApiAppointmentBookingType.UserDefined ||
    bookingType === ApiAppointmentBookingType.AppointmentBlock
  ) {
    return <Chip color={"success"}>Gebucht</Chip>;
  } else if (bookingType === ApiAppointmentBookingType.Cancelled) {
    return <Chip color={"danger"}>Abgesagt</Chip>;
  } else {
    return <Chip color={"warning"}>Noch nicht gebucht</Chip>;
  }
}

export function appointmentOverviewEntriesColumns() {
  return [
    columnHelper.accessor("lastName", {
      header: "Name",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("firstName", {
      header: "Vorname",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("age", {
      header: "Alter",
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("travelStartDate", {
      header: "Reisebeginn",
      cell: (props) => formatDate(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("createdBy", {
      header: "Erstellt von",
      cell: (props) => translateCreatedByUserType(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => (
        <Chip color={statusColors[props.getValue()]}>
          {procedureStatusNames[props.getValue()]}
        </Chip>
      ),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("appointment", {
      header: "Termin",
      cell: (props) => formatDateTime(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("appointmentType", {
      header: "Terminart",
      cell: (props) => translateAppointmentType(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("appointmentBookingType", {
      header: "Terminstatus",
      cell: (props) => formatBookingType(props.getValue()),
    }),
  ];
}

export const initialSorting: SortingState = [
  {
    id: "appointment",
    desc: false,
  },
];
