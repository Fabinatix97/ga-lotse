/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";

import { InformationSheet } from "@eshg/lib-employee-portal";

import { ProcedureCreatedByTile } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ProcedureCreatedByTile";
import { TravelDataTile } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/TravelDataTile";
import { CreateProcedureValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";

export function ProcedureDetailsPanel(
  props: Readonly<{
    initialValues: CreateProcedureValues;
    procedureClosed: boolean;
  }>,
) {
  return (
    <InformationSheet>
      <ProcedureCreatedByTile
        initialValues={{
          createdByUserType: props.initialValues.createdByUserType,
        }}
      />
      <Divider orientation="horizontal" />
      <TravelDataTile
        initialValues={props.initialValues}
        isProcedureClosed={props.procedureClosed}
      />
    </InformationSheet>
  );
}
