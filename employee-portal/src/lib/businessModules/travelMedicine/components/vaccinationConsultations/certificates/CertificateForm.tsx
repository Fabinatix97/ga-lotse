/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiAppliedService,
  ApiCertificateType,
  ApiStepWithAppliedServices,
} from "@eshg/travel-medicine-api";
import { Stack } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { Ref } from "react";

import { CERTIFICATE_TYPE_OPTIONS } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/certificates/options";
import {
  CheckboxGroup,
  Mode,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/CheckboxGroup";

export interface CertificateFormValues {
  certificateType: ApiCertificateType;
  selectedProcedureStepId: string;
  appliedServices: ApiAppliedService[];
  allAppliedServices: ApiAppliedService[];
}

interface CertificateFormProps {
  initialValues: CertificateFormValues;
  formRef: Ref<SidebarFormHandle>;
  procedureId: string;
  stepsWithAppliedServices: ApiStepWithAppliedServices[];
  title: string;
  submitButtonLabel: string;
  onSubmit: (values: CertificateFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CertificateForm(props: Readonly<CertificateFormProps>) {
  function buildAppointmentOptions(): SelectOption<string, string>[] {
    return props.stepsWithAppliedServices.map((stepWithAppliedServices) => {
      return {
        label:
          formatDateTime(stepWithAppliedServices.appointmentDateTime) + " Uhr",
        value: stepWithAppliedServices.procedureStepId,
      };
    });
  }

  async function updateAppliedServicesOptions(
    procedureStepId: string,
    setFieldValue: (
      field: string,
      value: [] | ApiAppliedService[],
    ) => Promise<void | FormikErrors<CertificateFormValues>>,
  ) {
    const appliedServices = props.stepsWithAppliedServices.find(
      (stepsWithAppliedServices) =>
        stepsWithAppliedServices.procedureStepId == procedureStepId,
    )!.appliedServices;
    await setFieldValue("appliedServices", []);
    await setFieldValue("allAppliedServices", appliedServices);
  }

  function validateSidebar(values: CertificateFormValues) {
    const errors: FormikErrors<CertificateFormValues> = {};

    if (values.certificateType === undefined) {
      errors.certificateType = "Bitte eine Bescheinigungsart auswählen";
    }
    if (
      values.selectedProcedureStepId === undefined ||
      values.selectedProcedureStepId === ""
    ) {
      errors.selectedProcedureStepId = "Bitte einen Termin auswählen";
    }

    return errors;
  }

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
      validate={validateSidebar}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack direction="column" gap={2}>
              <SelectField
                name="certificateType"
                label="Bescheinigung"
                options={CERTIFICATE_TYPE_OPTIONS}
              />
              <SelectField
                name="selectedProcedureStepId"
                label="Impftermin"
                options={buildAppointmentOptions()}
                onChange={async (procedureStepId) =>
                  await updateAppliedServicesOptions(
                    procedureStepId,
                    setFieldValue,
                  )
                }
              />
              {values.selectedProcedureStepId !== "" ? (
                <CheckboxGroup
                  mode={Mode.appliedService}
                  name="appliedServices"
                  label="Impfungen"
                  element={values.allAppliedServices}
                />
              ) : null}
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitButtonLabel}
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
