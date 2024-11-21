/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiVaccinationConsultationSearch } from "@eshg/employee-portal-api/travelMedicine";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { calculateAge } from "@eshg/lib-portal/helpers/dateTime";
import { Chip } from "@mui/joy";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { translateCreatedByUserType } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/translations";
import {
  procedureStatusNames,
  statusColors,
} from "@/lib/shared/components/procedures/constants";

const columnHelper: ColumnHelper<ApiVaccinationConsultationSearch> =
  createColumnHelper<ApiVaccinationConsultationSearch>();

export function searchColumns() {
  return [
    columnHelper.accessor("lastName", {
      header: "Nachname",
      meta: {
        width: 150,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("firstName", {
      header: "Vorname",
      meta: {
        width: 150,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      id: "birthDate", // we need this id because we are using dateOfBirth two times in the table
      header: "Geburtsdatum",
      cell: (props) => formatDate(props.getValue()),
      meta: {
        width: 120,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("dateOfBirth", {
      id: "age", // we need this id because we are using dateOfBirth two times in the table
      header: "Alter",
      cell: (props) => calculateAge(props.getValue()),
      meta: {
        width: 70,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("travelStartDate", {
      header: "Reisebeginn",
      cell: (props) => formatDate(props.getValue()),
      meta: {
        width: 110,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("createdBy", {
      header: "Erstellt von",
      cell: (props) => translateCreatedByUserType(props.getValue()),
      meta: {
        width: 100,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => (
        <Chip color={statusColors[props.getValue()]} size="md">
          {procedureStatusNames[props.getValue()]}
        </Chip>
      ),
      meta: {
        width: 130,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
  ];
}
