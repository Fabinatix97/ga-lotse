/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  validateNonNegativeNumberWithAtMostTwoDecimalDigits,
} from "@eshg/lib-employee-portal";
import {
  CheckboxField,
  InputField,
  NumberField,
  useValidateLength,
  validatePipe,
  validateRange,
} from "@eshg/lib-portal";

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
  const validateLength = useValidateLength();
  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <InputField
                autoFocus
                name="diseaseName"
                label="Name"
                required="Bitte einen Namen angeben"
                validate={validateLength(0, 200)}
              />
              <NumberField
                name="estimatedFee"
                label="Preisangabe in € für das Bürgerportal"
                min={0}
                max={999999}
                validate={validatePipe(
                  validateRange(0, 999999),
                  validateNonNegativeNumberWithAtMostTwoDecimalDigits,
                )}
              />
              <CheckboxField
                name="visibleToCitizenPortal"
                label="Sichtbarkeit im Bürgerportal"
                sx={{
                  pt: "8px",
                  fontSize: "sm",
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
