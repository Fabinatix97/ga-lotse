/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarMonthOutlined } from "@mui/icons-material";

import { useBulkCreateAppointment } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/useBulkCreateAppointment";
import { RowSelectionTableToolbarButton } from "@/lib/shared/components/table/RowSelectionTableToolbarButton";

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
