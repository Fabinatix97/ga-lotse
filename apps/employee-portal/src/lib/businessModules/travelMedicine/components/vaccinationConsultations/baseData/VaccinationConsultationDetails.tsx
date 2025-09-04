/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid, Stack } from "@mui/joy";

import { ApiCountryCode } from "@eshg/base-api";
import { Alert } from "@eshg/lib-portal";
import {
  ApiCreatedByUserType,
  ApiGetVaccinationConsultationDetailsResponse,
  ApiPatient,
  ApiPersonSync,
  ApiProcedureStatus,
  ApiServicePlanGroup,
  ApiTravelTimeUnit,
  ApiTravelType,
} from "@eshg/travel-medicine-api";

import { DetailsGrid } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/DetailsGrid";
import { PatientPanel } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/PatientPanel";
import { ProcedureActionsPanel } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ProcedureActionsPanel";
import { ProcedureDetailsPanel } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ProcedureDetailsPanel";
import { ServicePlanTable } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicePlanTable";

export interface CreateProcedureValues {
  externalId: string;
  status: ApiProcedureStatus;
  patient: ApiPatient;
  personSync: ApiPersonSync;
  travelType: ApiTravelType;
  travelDestinations: ApiCountryCode[];
  travelStartDate?: string;
  travelTimeAmount?: number;
  travelTimeUnit?: ApiTravelTimeUnit;
  services: ApiServicePlanGroup[];
  templateId?: string;
  initialAppointmentProcedureStepId: string;
  createdByUserType: ApiCreatedByUserType;
}

const SPACING = { xxs: 2, sm: 3, md: 3, xxl: 3 };

interface VaccinationConsultationPageProps {
  procedure: ApiGetVaccinationConsultationDetailsResponse;
}

export function VaccinationConsultationDetails(
  props: Readonly<VaccinationConsultationPageProps>,
) {
  const initialValues = createInitialFormValues(props.procedure);

  const isProcedureClosed: boolean =
    props.procedure.status === ApiProcedureStatus.Closed;

  function createInitialFormValues(
    newData: ApiGetVaccinationConsultationDetailsResponse,
  ): CreateProcedureValues {
    return {
      externalId: newData.procedureId as unknown as string,
      status: newData.status,
      patient: newData.patient,
      ...newData.travelInformation,
      personSync: newData.personSync,
      travelStartDate:
        newData.travelInformation.travelStartDate
          ?.toISOString()
          .split("T")[0] ?? "",
      travelTimeAmount:
        newData.travelInformation.travelTimeAmount ?? ("" as unknown as number),
      services: newData.servicePlanGroups,
      initialAppointmentProcedureStepId: newData.initialProcedureStepId,
      createdByUserType: newData.createdByUserType,
    };
  }

  return (
    <DetailsGrid>
      <Grid xs={12}>
        {props.procedure.createdByUserType ===
          ApiCreatedByUserType.CitizenPortal &&
          props.procedure.status === ApiProcedureStatus.Draft && (
            <Alert
              color="warning"
              message="Dieser Entwurf kommt aus einer externen Quelle. Bitte kontrollieren Sie die Daten, bevor Sie den Vorgang starten."
            />
          )}
      </Grid>
      <Grid xs={9} display="flex" data-testid="patient">
        <PatientPanel
          procedureId={initialValues.externalId}
          patient={initialValues.patient}
          person={initialValues.personSync}
          isProcedureClosed={isProcedureClosed}
          isProcedureDraft={props.procedure.status === ApiProcedureStatus.Draft}
        />
      </Grid>
      <Grid xs={3}>
        <Stack spacing={SPACING}>
          <ProcedureDetailsPanel
            initialValues={initialValues}
            procedureClosed={isProcedureClosed}
          />
          <ProcedureActionsPanel
            procedure={props.procedure}
            dataTestid="procedure-actions"
          />
        </Stack>
      </Grid>

      <Grid xs={12}>
        <ServicePlanTable
          data={initialValues.services}
          procedureId={initialValues.externalId ?? ""}
          isProcedureClosed={isProcedureClosed}
          initialAppointmentProcedureStepId={
            initialValues.initialAppointmentProcedureStepId
          }
          createdByUserType={initialValues.createdByUserType}
        />
      </Grid>
    </DetailsGrid>
  );
}
