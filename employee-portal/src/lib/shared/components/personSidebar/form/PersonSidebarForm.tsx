/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Formik, FormikProps } from "formik";
import { ComponentType, Ref } from "react";

import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";

export interface PersonFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export type PersonFormProps<TValues> = FormikProps<TValues> & {
  title: string;
  subtitle?: string;
  submitLabel: string;
  onBack?: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  addressRequired?: boolean;
  mode?: "edit" | "create";
};

export interface PersonSidebarFormProps<TValues> {
  title: string;
  subtitle?: string;
  submitLabel?: string;
  onBack?: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSubmit: (person: TValues) => Promise<void>;
  initialValues: TValues;
  component: ComponentType<PersonFormProps<TValues>>;
  addressRequired?: boolean;
  sidebarFormRef: Ref<SidebarFormHandle>;
  mode?: "edit" | "create";
}

export function PersonSidebarForm<TValues extends PersonFormValues>(
  props: PersonSidebarFormProps<TValues>,
) {
  const FormComponent = props.component;

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {(formikProps) => (
        <SidebarForm ref={props.sidebarFormRef}>
          <FormComponent
            {...formikProps}
            title={props.title}
            subtitle={props.subtitle}
            submitLabel={props.submitLabel ?? "Speichern"}
            addressRequired={props.addressRequired}
            mode={props.mode}
            onBack={props.onBack}
            onCancel={props.onCancel}
            onDelete={props.onDelete}
          />
        </SidebarForm>
      )}
    </Formik>
  );
}
