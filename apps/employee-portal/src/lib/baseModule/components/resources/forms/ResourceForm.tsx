/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { ApiLabel, ApiResourceType } from "@eshg/base-api";
import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  InputField,
  OptionalFieldValue,
  SelectField,
  TextareaField,
} from "@eshg/lib-portal";

import { LabelField } from "@/lib/baseModule/components/labels/LabelField";
import { resourceTypeOptions } from "@/lib/baseModule/components/resources/constants";

export interface ResourceFormValues {
  type: OptionalFieldValue<ApiResourceType>;
  name: string;
  labelNames: string[];
  articleNumber: string;
  description: string;
}

interface ResourceFormProps {
  initialValues: ResourceFormValues;
  labels: ApiLabel[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: ResourceFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
  canChooseType?: boolean;
}

export function ResourceForm(props: ResourceFormProps) {
  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack spacing={2}>
              <InputField
                autoFocus
                name="name"
                label="Name"
                required="Bitte einen Namen angeben"
              />
              {props.canChooseType && (
                <SelectField
                  name="type"
                  label="Typ"
                  options={resourceTypeOptions}
                  required="Bitte einen Typ angeben"
                />
              )}
              <InputField name="articleNumber" label="Artikelnummer" />
              <LabelField
                options={props.labels.map((label) => label.name)}
                name="labelNames"
                label="Labels"
              />
              <TextareaField
                name="description"
                label="Beschreibung"
                sxTextarea={{ minHeight: 130 }}
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
