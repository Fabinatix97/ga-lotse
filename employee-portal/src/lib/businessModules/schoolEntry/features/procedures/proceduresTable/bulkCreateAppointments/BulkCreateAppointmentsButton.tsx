/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RowSelectionTableToolbarButton } from "@eshg/lib-employee-portal";
import { CalendarMonthOutlined } from "@mui/icons-material";

import { useBulkCreateAppointment } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/useBulkCreateAppointment";

interface BulkCreateAppointmentsButtonProps {
  selectedProcedureIds: string[];
}

export function BulkCreateAppointmentsButton(
  props: BulkCreateAppointmentsButtonProps,
) {
  const { isPending, startAppointmentCreation } = useBulkCreateAppointment(
    props.selectedProcedureIds,
  );
  return (
    <RowSelectionTableToolbarButton
      decorator={<CalendarMonthOutlined />}
      isPending={isPending}
      disabled={isPending}
      onClick={startAppointmentCreation}
    >
      Termine zuweisen
    </RowSelectionTableToolbarButton>
  );
}
