/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Formik, FormikProps } from "formik";
import { ComponentType, Ref } from "react";

import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface FacilitySearchFormValues {
  name: string;
}

export interface FacilitySearchFormProps<TValues> {
  title: string;
  loading: boolean;
  initialValues: TValues;
  formFieldsComponent: ComponentType<FormikProps<TValues>>;
  sidebarFormRef?: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSearch: (values: TValues) => void;
}

export function FacilitySearchForm<TValues extends FacilitySearchFormValues>(
  props: FacilitySearchFormProps<TValues>,
) {
  const FormFieldsComponent = props.formFieldsComponent;
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={(values) => {
        props.onSearch(values);
        return Promise.resolve();
      }}
    >
      {({ isSubmitting, ...formikProps }) => (
        <SidebarForm ref={props.sidebarFormRef}>
          <SidebarContent title={props.title}>
            <FormFieldsComponent {...formikProps} isSubmitting={isSubmitting} />
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={props.loading || isSubmitting}
              submitLabel={"Weiter"}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
