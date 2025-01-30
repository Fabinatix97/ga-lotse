/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentSummary } from "@eshg/travel-medicine-api";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { AppointmentSheet } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AppointmentSheet";
import { createAppointmentOptions } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface AssignServiceFormValues {
  procedureStepId?: string;
}

interface AssignServiceFormProps {
  initialValues: AssignServiceFormValues;
  allAvailableAppointments: ApiAppointmentSummary[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: AssignServiceFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function AssignServiceForm(props: Readonly<AssignServiceFormProps>) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack spacing={2}>
              <Stack gap={2}>
                <AppointmentSheet
                  name="procedureStepId"
                  label="Termin aus Vorgang"
                  options={createAppointmentOptions(
                    props.allAvailableAppointments,
                  )}
                />
              </Stack>
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
