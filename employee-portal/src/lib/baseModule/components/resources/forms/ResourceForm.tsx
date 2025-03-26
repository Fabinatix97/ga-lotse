/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiLabel, ApiResourceType } from "@eshg/base-api";
import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  TextareaField,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { LabelField } from "@/lib/baseModule/components/labels/LabelField";
import { resourceTypeOptions } from "@/lib/baseModule/components/resources/constants";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";

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
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack spacing={2}>
              <InputField
                name="name"
                label="Name"
                required="Bitte einen Namen angeben"
              />
              {props.canChooseType && (
                <SelectField
                  name={"type"}
                  label={"Typ"}
                  options={resourceTypeOptions}
                  required={"Bitte einen Typ angeben"}
                />
              )}
              <InputField name={"articleNumber"} label={"Artikelnummer"} />
              <LabelField
                options={props.labels.map((label) => label.name)}
                name={"labelNames"}
                label={"Labels"}
              />
              <TextareaField
                name={"description"}
                label={"Beschreibung"}
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
