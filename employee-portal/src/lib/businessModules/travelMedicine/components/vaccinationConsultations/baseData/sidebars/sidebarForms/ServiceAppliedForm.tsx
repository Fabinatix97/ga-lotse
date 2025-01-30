/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { ApiUser } from "@eshg/travel-medicine-api";
import { Sheet, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { AppliedByFields } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AppliedByFields";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
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
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack direction="column" gap={2} data-testid="serviceApplied">
              <Sheet>
                <Stack direction="column" gap={2}>
                  <DetailsCell
                    name="vaccinationInfo"
                    label="Impfung"
                    value={props.initialValues.vaccinationInfo}
                  />
                  <DetailsCell
                    name="vaccineName"
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
