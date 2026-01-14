/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { ApiInventoryItemType, ApiLabel } from "@eshg/base-api";
import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  validateNonNegativeInteger,
} from "@eshg/lib-employee-portal";
import {
  InputField,
  NumberField,
  OptionalFieldValue,
  SelectField,
  TextareaField,
} from "@eshg/lib-portal";

import { inventoryTypeOptions } from "@/lib/baseModule/components/inventory/constants";
import { LabelField } from "@/lib/baseModule/components/labels/LabelField";

export interface InventoryFormValues {
  type: OptionalFieldValue<ApiInventoryItemType>;
  name: string;
  minCount: OptionalFieldValue<number>;
  labelNames: string[];
  articleNumber: string;
  description: string;
}

interface UpdateInventoryFormProps {
  initialValues: InventoryFormValues;
  labels: ApiLabel[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: InventoryFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function InventoryForm(props: UpdateInventoryFormProps) {
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
                name="name"
                label="Name"
                required="Bitte einen Namen angeben"
              />
              <SelectField
                label="Typ"
                name="type"
                required="Bitte einen Typ auswählen"
                options={inventoryTypeOptions}
              />
              <NumberField
                name="minCount"
                label="Mindestbestand"
                required="Bitte einen Mindestbestand angeben"
                validate={validateNonNegativeInteger}
              />
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
