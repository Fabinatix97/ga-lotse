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
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { validateNonNegativeNumberWithAtMostTwoDecimalDigits } from "@/lib/shared/helpers/validators";

export interface DiseaseFormValues {
  currentDiseaseId: string | undefined;
  diseaseName: string;
  estimatedFee: string; // no other way to get the optional number field cleared :(
  visibleToCitizenPortal: boolean;
}

interface DiseaseFormProps {
  initialValues: DiseaseFormValues;
  formRef: Ref<SidebarFormHandle>;
  title: string;
  submitButtonLabel: string;
  onSubmit: (values: DiseaseFormValues) => Promise<void>;
  onCancel: () => void;
}

export function DiseaseForm(props: Readonly<DiseaseFormProps>) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <InputField
                name="diseaseName"
                label="Name"
                required="Bitte einen Namen angeben"
                validate={validateLength(0, 200)}
              />
              <NumberField
                name="estimatedFee"
                label="Preisangabe in € für das Bürgerportal"
                min={0.0}
                validate={validateNonNegativeNumberWithAtMostTwoDecimalDigits}
              />
              <CheckboxField
                name="visibleToCitizenPortal"
                label="Sichtbarkeit im Bürgerportal"
                sx={{
                  pt: "8px",
                  fontSize: "14px",
                }}
              />
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
