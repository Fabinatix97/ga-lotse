/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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

export interface OtherServiceAppliedFormValues {
  serviceTypeDescription: string;
  appliedAt: string;
  physician: string;
  medicalAssistant?: string;
}

interface OtherServiceAppliedFormProps {
  initialValues: OtherServiceAppliedFormValues;
  allPhysicians: ApiUser[];
  allMedicalAssistants: ApiUser[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: OtherServiceAppliedFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function OtherServiceAppliedForm(
  props: Readonly<OtherServiceAppliedFormProps>,
) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack direction="column" gap={2} data-testid="otherServiceApplied">
              <Sheet>
                <Stack direction="column" gap={2}>
                  <DetailsCell
                    name="serviceTypeDescription"
                    label="Leistungsart"
                    value={props.initialValues.serviceTypeDescription}
                  />
                </Stack>
              </Sheet>
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
