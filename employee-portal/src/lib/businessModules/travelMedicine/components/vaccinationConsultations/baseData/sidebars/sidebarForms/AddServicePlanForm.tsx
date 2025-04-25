/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  ApiAppointmentSummary,
  ApiDisease,
  ApiOtherServiceTemplate,
  ApiPostOtherServiceRequest,
  ApiPostVaccinationRequest,
  ApiVaccine,
} from "@eshg/travel-medicine-api";

import { AppointmentSheet } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AppointmentSheet";
import { ServicesSheet } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/ServicesSheet";
import { createAppointmentOptions } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";

export type ServicesRequest = ApiPostOtherServiceRequest &
  ApiPostVaccinationRequest & { serviceType: string; templateId: string };

export interface AddServicePlanFormValues {
  procedureId: string;
  procedureStepId?: string;
  services: ServicesRequest[];
}

interface AddServicePlanFormProps {
  initialValues: AddServicePlanFormValues;
  allAvailableAppointments: ApiAppointmentSummary[];
  allOtherServiceTemplates: ApiOtherServiceTemplate[];
  allVaccines: ApiVaccine[];
  allDiseases: ApiDisease[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: AddServicePlanFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function AddServicePlanForm(props: Readonly<AddServicePlanFormProps>) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack flexDirection="column" gap={2} data-testid="appointment">
              <AppointmentSheet
                name="procedureStepId"
                label="Termin aus Vorgang"
                options={[
                  { label: "", value: "" },
                  ...createAppointmentOptions(props.allAvailableAppointments),
                ]}
              />
              <ServicesSheet
                allDiseases={props.allDiseases}
                allOtherServiceTemplates={props.allOtherServiceTemplates}
                allVaccines={props.allVaccines}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitLabel}
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
