/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Formik, FormikHelpers } from "formik";
import { ComponentType, Ref } from "react";

import { SidebarForm } from "../../../drawer/components/SidebarForm";
import { SidebarFormHandle } from "../../../drawer/types/sidebar";
import { PersonFormProps, PersonFormValues } from "../../types/personForm";

export interface PersonSidebarFormProps<TValues> {
  title: string;
  subtitle?: string;
  submitLabel?: string;
  onBack?: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSubmit: (person: TValues, helpers: FormikHelpers<TValues>) => Promise<void>;
  initialValues: TValues;
  component: ComponentType<PersonFormProps<TValues>>;
  addressRequired?: boolean;
  canChooseAddressType?: boolean;
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
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {(formikProps) => (
        <SidebarForm ref={props.sidebarFormRef}>
          <FormComponent
            {...formikProps}
            title={props.title}
            subtitle={props.subtitle}
            submitLabel={props.submitLabel ?? "Speichern"}
            addressRequired={props.addressRequired}
            canChooseAddressType={props.canChooseAddressType}
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
