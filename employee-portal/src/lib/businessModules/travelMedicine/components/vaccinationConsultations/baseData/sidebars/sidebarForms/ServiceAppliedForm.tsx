/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import {
  DetailsItem,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal";
import { ApiUser } from "@eshg/travel-medicine-api";

import { AppliedByFields } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AppliedByFields";
import { validateRequiredBatchId } from "@/lib/shared/helpers/validators";

export interface ServiceAppliedFormValues {
  vaccinationInfo: string;
  vaccineName: string;
  batchIdentifier: string;
  appliedAt: string;
  physician: string;
  medicalAssistant?: string;
}

interface ServiceAppliedFormProps {
  initialValues: ServiceAppliedFormValues;
  allPhysicians: ApiUser[];
  allMedicalAssistants: ApiUser[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: ServiceAppliedFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function ServiceAppliedForm(props: Readonly<ServiceAppliedFormProps>) {
  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack direction="column" gap={2} data-testid="serviceApplied">
              <Sheet>
                <Stack direction="column" gap={2}>
                  <DetailsItem
                    label="Impfung"
                    value={props.initialValues.vaccinationInfo}
                  />
                  <DetailsItem
                    label="Impfstoff"
                    value={props.initialValues.vaccineName}
                  />
                </Stack>
              </Sheet>
              <InputField
                name="batchIdentifier"
                label="Charge"
                required="Bitte geben Sie eine Charge an"
                validate={validateRequiredBatchId}
              />
              <AppliedByFields
                allPhysicians={props.allPhysicians}
                allMedicalAssistants={props.allMedicalAssistants}
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
