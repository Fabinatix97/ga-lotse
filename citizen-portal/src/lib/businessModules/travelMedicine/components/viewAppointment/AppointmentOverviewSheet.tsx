/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentSummary } from "@eshg/citizen-portal-api/travelMedicine";
import { Stack } from "@mui/joy";

import { AppointmentOverviewSheetButton } from "@/lib/businessModules/travelMedicine/components/viewAppointment/AppointmentOverviewSheetButton";
import { NoAppointments } from "@/lib/businessModules/travelMedicine/components/viewAppointment/NoAppointments";
import { OverviewAppointmentTypes } from "@/lib/businessModules/travelMedicine/components/viewAppointment/TypeSwitchButtons";

interface AppointmentOverviewSheetButtonsProps {
  procedureId: string;
  overviewAppointmentType: OverviewAppointmentTypes;
  appointments: ApiAppointmentSummary[];
}

export function AppointmentOverviewSheet(
  props: Readonly<AppointmentOverviewSheetButtonsProps>,
) {
  return props.appointments.length === 0 ? (
    <NoAppointments overviewAppointmentType={props.overviewAppointmentType} />
  ) : (
    <Stack gap={2} data-testid={"appointment-overview-list"}>
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
