/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeeOmsProcedureDetails } from "@eshg/employee-portal-api/officialMedicalService";
import { Button } from "@mui/joy";

import { useCreateAppointmentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AppointmentSidebar";
import { AppointmentsTable } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AppointmentsTable";
import { CalendarAddDay } from "@/lib/shared/components/icons/CalendarAddDay";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function AppointmentsPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const { open: openSidebar } = useCreateAppointmentSidebar(procedure.id);

  return (
    <InfoTile
      title="Termine"
      name="appointments"
      footer={
        <Button
          variant="plain"
          sx={{ justifyContent: "start", width: "fit-content" }}
          startDecorator={<CalendarAddDay />}
          onClick={openSidebar}
        >
          Termin hinzufügen
        </Button>
      }
    >
      <AppointmentsTable procedure={procedure} />
    </InfoTile>
  );
}
