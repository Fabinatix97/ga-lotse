/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeeOmsProcedureDetails } from "@eshg/official-medical-service-api";
import { Button } from "@mui/joy";

import { useCreateAppointmentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AppointmentSidebar";
import { AppointmentsTable } from "@/lib/businessModules/officialMedicalService/components/procedures/details/AppointmentsTable";
import { isProcedureFinalized } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { CalendarAddDay } from "@/lib/shared/components/icons/CalendarAddDay";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function AppointmentsPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const { open: openSidebar } = useCreateAppointmentSidebar(
    procedure.id,
    procedure.physician,
  );

  return (
    <InfoTile
      title="Termine"
      name="appointments"
      data-testid="appointments"
      footer={
        !isProcedureFinalized(procedure) && (
          <Button
            variant="plain"
            sx={{ justifyContent: "start", width: "fit-content" }}
            startDecorator={<CalendarAddDay />}
            onClick={openSidebar}
          >
            Termin hinzufügen
          </Button>
        )
      }
    >
      <AppointmentsTable procedure={procedure} />
    </InfoTile>
  );
}
