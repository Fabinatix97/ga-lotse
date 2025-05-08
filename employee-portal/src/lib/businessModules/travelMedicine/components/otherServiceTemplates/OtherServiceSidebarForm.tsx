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
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import {
  validatePipe,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import { useValidateLength } from "@eshg/lib-portal/hooks/useValidators";

import { validateNonNegativeNumberWithAtMostTwoDecimalDigits } from "@/lib/shared/helpers/validators";

export interface OtherServiceFormValues {
  description: string;
  fee: number;
  id: string;
}

interface OtherServiceFormProps {
  initialValues: OtherServiceFormValues;
  formRef: Ref<SidebarFormHandle>;
  title: string;
  submitButtonLabel: string;
  onSubmit: (values: OtherServiceFormValues) => Promise<void>;
  onCancel: () => void;
}

export function OtherServiceSidebarForm(
  props: Readonly<OtherServiceFormProps>,
) {
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
            <Stack gap={2}>
              <InputField
                name="description"
                label="Name"
                required="Bitte einen Namen angeben."
                validate={validateLength(0, 200)}
              />
              <NumberField
                name="fee"
                label="Preis in €"
                required="Bitte einen Preis angeben."
                min={0}
                max={999999}
                validate={validatePipe(
                  validateRange(0, 999999),
                  validateNonNegativeNumberWithAtMostTwoDecimalDigits,
                )}
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
