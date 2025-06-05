/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Edit } from "@mui/icons-material";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu } from "@eshg/lib-employee-portal";
import { ApiAppointmentTypeConfig } from "@eshg/travel-medicine-api";

import { translateAppointmentType } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/translations";

const columnHelper: ColumnHelper<ApiAppointmentTypeConfig> =
  createColumnHelper<ApiAppointmentTypeConfig>();

interface AppointmentTypesColumnsProps {
  editEntry: (apiAppointmentTypeConfig: ApiAppointmentTypeConfig) => void;
}

export function columns(props: AppointmentTypesColumnsProps) {
  return [
    columnHelper.accessor("appointmentTypeDto", {
      header: "Termintyp",
      cell: (props) => translateAppointmentType(props.getValue()),
    }),
    columnHelper.accessor("standardDurationInMinutes", {
      header: "Standard-Termindauer",
    }),
    columnHelper.display({
      header: "Aktionen",
      cell: (info) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Bearbeiten",
              onClick: () => props.editEntry(info.row.original),
              startDecorator: <Edit />,
            },
          ]}
        />
      ),
      meta: {
        width: 96,
      },
    }),
  ];
}
