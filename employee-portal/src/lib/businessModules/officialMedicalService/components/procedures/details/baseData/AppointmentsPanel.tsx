/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiEmployeeOmsProcedureDetails,
} from "@eshg/official-medical-service-api";
import { Button, Typography } from "@mui/joy";
import { isEmpty } from "remeda";

import { useCreateAppointmentSidebar } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AppointmentSidebar";
import { AppointmentsTable } from "@/lib/businessModules/officialMedicalService/components/procedures/details/baseData/AppointmentsTable";
import {
  isProcedureFinalized,
  procedureHasOpenAppointments,
} from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { CalendarAddDay } from "@/lib/shared/components/icons/CalendarAddDay";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

export function AppointmentsPanel({
  procedure,
}: Readonly<{
  procedure: ApiEmployeeOmsProcedureDetails;
}>) {
  const { open: openSidebar } = useCreateAppointmentSidebar(
    procedure.id,
    procedure.concern?.appointmentType ??
      ApiAppointmentType.OfficialMedicalServiceShort,
    procedure.physician,
  );

  return (
    <InfoTile
      title="Termine"
      name="appointments"
      data-testid="appointments"
      footer={
        !isProcedureFinalized(procedure) &&
        !procedureHasOpenAppointments(procedure) && (
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
      <>
        {isProcedureFinalized(procedure) && isEmpty(procedure.appointments) && (
          <Typography data-testid="no-appointments-text">
            Keine Termine vorhanden
          </Typography>
        )}
        <AppointmentsTable procedure={procedure} />
      </>
    </InfoTile>
  );
}
