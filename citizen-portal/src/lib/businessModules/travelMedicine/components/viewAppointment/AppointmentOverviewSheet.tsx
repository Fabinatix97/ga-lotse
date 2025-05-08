/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { ApiAppointmentSummary } from "@eshg/travel-medicine-api";

import { OverviewAppointmentType } from "@/lib/businessModules/stiProtection/components/appointments/helpers";
import { AppointmentOverviewSheetButton } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentOverviewSheetButton";
import { NoAppointments } from "@/lib/businessModules/travelMedicine/components/viewAppointment/NoAppointments";

interface AppointmentOverviewSheetButtonsProps {
  procedureId: string;
  overviewAppointmentType: OverviewAppointmentType;
  appointments: ApiAppointmentSummary[];
}

export function AppointmentOverviewSheet(
  props: Readonly<AppointmentOverviewSheetButtonsProps>,
) {
  return props.appointments.length === 0 ? (
    <NoAppointments overviewAppointmentType={props.overviewAppointmentType} />
  ) : (
    <Stack gap={2} data-testid="appointment-overview-list">
      {props.appointments.map((appointment, idx) => (
        <AppointmentOverviewSheetButton
          key={idx}
          index={idx}
          procedureId={props.procedureId}
          appointment={appointment}
        />
      ))}
    </Stack>
  );
}
