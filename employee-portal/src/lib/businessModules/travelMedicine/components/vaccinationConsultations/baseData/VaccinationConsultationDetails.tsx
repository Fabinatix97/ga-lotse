/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiCountryCode } from "@eshg/employee-portal-api/base";
import {
  ApiAppointmentSummary,
  ApiGetVaccinationConsultationDetailsResponse,
  ApiInformationStatement,
  ApiPatient,
  ApiProcedureStatus,
  ApiServicePlanEntry,
  ApiTravelMedicineFeature,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/employee-portal-api/travelMedicine";
import { Grid, Stack } from "@mui/joy";
import { useState } from "react";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import { AssignAppointmentValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AssignAppointmentSidebar";
import { CloseProcedurePanel } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/CloseProcedurePanel";
import { DetailsGrid } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/DetailsGrid";
import { InformationStatementValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/InformationStatementSidebar";
import { InformationStatementsTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/InformationStatementsTable";
import { OtherServiceAppliedValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/OtherServiceAppliedSideBar";
import { PatientPanel } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/PatientPanel";
import { ProcedureDetailsPanel } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ProcedureDetailsPanel";
import { ServiceAppliedValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServiceAppliedSideBar";
import {
  Mode,
  ServiceAppointmentValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServiceAppointmentSidebar";
import { ServiceValues } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanSidebar";
import { ServicePlanTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanTable";

export interface VaccinationConsultationSidebarsProps {
  open: boolean;
  mode?: Mode;
  initialValues:
    | InformationStatementValues
    | ServiceValues
    | AssignAppointmentValues
    | ServiceAppointmentValues
    | ServiceAppliedValues
    | OtherServiceAppliedValues;
}

export interface CreateProcedureValues {
  externalId: string;
  status: ApiProcedureStatus;
  patient: ApiPatient;
  travelType: ApiTravelType;
  travelDestinations: ApiCountryCode[];
  travelStartDate?: string;
  travelTimeAmount?: number;
  travelTimeUnit?: ApiTravelTimeUnit;
  services: ApiServicePlanEntry[];
  informationStatements: ApiInformationStatement[];
  templateId?: string;
  initialAppointment: ApiAppointmentSummary;
}
const SPACING = { xxs: 2, sm: 3, md: 3, xxl: 3 };

export interface VaccinationConsultationPageProps {
  procedure: ApiGetVaccinationConsultationDetailsResponse;
}

export function VaccinationConsultationDetails(
  props: Readonly<VaccinationConsultationPageProps>,
) {
  const initialValues = createInitialFormValues(props.procedure);

  const [isProcedureClosed, setIsProcedureClosed] = useState<boolean>(
    props.procedure.status === ApiProcedureStatus.Closed,
  );

  const isInformationStatementEnabled = useIsNewFeatureEnabled(
    ApiTravelMedicineFeature.CitizenPortalInformationStatement,
  );

  function createInitialFormValues(
    newData: ApiGetVaccinationConsultationDetailsResponse,
  ): CreateProcedureValues {
    return {
      externalId: newData.procedureId as unknown as string,
      status: newData.status,
      patient: newData.patient,
      ...newData.travelInformation,
      travelStartDate:
        newData.travelInformation.travelStartDate
          ?.toISOString()
          .split("T")[0] ?? "",
      travelTimeAmount:
        newData.travelInformation.travelTimeAmount ?? ("" as unknown as number),
      services: newData.servicePlanList,
      informationStatements: newData.informationStatements,
      initialAppointment: newData.initialAppointment,
    };
  }

  return (
    <DetailsGrid>
      <Grid xs={9} display={"flex"} data-testid={"patient"}>
        <PatientPanel
          procedureId={initialValues.externalId}
          patient={initialValues.patient}
          isProcedureClosed={isProcedureClosed}
        />
      </Grid>
      <Grid xs={3}>
        <Stack spacing={SPACING}>
          <ProcedureDetailsPanel
            initialValues={initialValues}
            procedureClosed={isProcedureClosed}
          />
          <CloseProcedurePanel
            procedure={initialValues}
            dataTestid="button-close-reopen"
            setIsProcedureClosed={setIsProcedureClosed}
          />
        </Stack>
      </Grid>

      <Grid xs={12}>
        <ServicePlanTable
          data={initialValues.services}
          procedureId={initialValues.externalId ?? ""}
          isProcedureClosed={isProcedureClosed}
        ></ServicePlanTable>
      </Grid>

      <Grid xs={12}>
        {isInformationStatementEnabled && (
          <InformationStatementsTable
            data={initialValues.informationStatements}
            procedureId={initialValues.externalId ?? ""}
            isProcedureClosed={isProcedureClosed}
          ></InformationStatementsTable>
        )}
      </Grid>
    </DetailsGrid>
  );
}
