/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CalendarMonthOutlined } from "@mui/icons-material";

import { RowSelectionTableToolbarButton } from "@eshg/lib-employee-portal";

import { useBulkCreateAppointmentsSidebar } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/BulkCreateAppointmentsSidebar";
import { useBulkCreateAppointment } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkCreateAppointments/useBulkCreateAppointment";

interface BulkCreateAppointmentsButtonProps {
  selectedProcedureIds: string[];
}

export function BulkCreateAppointmentsButton(
  props: BulkCreateAppointmentsButtonProps,
) {
  const useParameterizedSidebarResult = useBulkCreateAppointmentsSidebar();
  const { isPending, startAppointmentCreation } = useBulkCreateAppointment(
    props.selectedProcedureIds,
  );
  return (
    <RowSelectionTableToolbarButton
      decorator={<CalendarMonthOutlined />}
      isPending={isPending}
      disabled={isPending}
      onClick={() => {
        useParameterizedSidebarResult.open({
          startAppointmentCreation,
        });
      }}
    >
      Termine zuweisen
    </RowSelectionTableToolbarButton>
  );
}
