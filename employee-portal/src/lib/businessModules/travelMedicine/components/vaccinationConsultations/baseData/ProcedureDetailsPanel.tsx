/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";

import { InitialAppointmentTile } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/InitialAppointmentTile";
import { TravelDataTile } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TravelDataTile";
import { CreateProcedureValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

export function ProcedureDetailsPanel(
  props: Readonly<{
    initialValues: CreateProcedureValues;
    procedureClosed: boolean;
  }>,
) {
  return (
    <InformationSheet>
      <InitialAppointmentTile
        initialValues={{
          initialAppointment: props.initialValues.initialAppointment,
        }}
        isProcedureClosed={props.procedureClosed}
      />
      <Divider orientation="horizontal" />
      <TravelDataTile
        initialValues={props.initialValues}
        isProcedureClosed={props.procedureClosed}
      />
    </InformationSheet>
  );
}
