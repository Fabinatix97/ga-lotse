/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Edit } from "@mui/icons-material";
import { ColumnHelper, createColumnHelper } from "@tanstack/react-table";

import { ActionsMenu } from "@eshg/lib-employee-portal";
import { ApiAppointmentTypeConfig } from "@eshg/sti-protection-api";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/stiProtection/shared/constants";

const columnHelper: ColumnHelper<ApiAppointmentTypeConfig> =
  createColumnHelper<ApiAppointmentTypeConfig>();

export function appointmentTypesColumns(
  editEntry: (type: ApiAppointmentTypeConfig) => void,
) {
  return [
    columnHelper.accessor("appointmentTypeDto", {
      header: "Termintyp",
      cell: (props) => APPOINTMENT_TYPES[props.getValue()],
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
              onClick: () => editEntry(info.row.original),
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
