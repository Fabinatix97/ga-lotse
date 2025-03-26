/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInventoryItemType, ApiLabel } from "@eshg/base-api";
import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  TextareaField,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { inventoryTypeOptions } from "@/lib/baseModule/components/inventory/constants";
import { LabelField } from "@/lib/baseModule/components/labels/LabelField";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { validateNonNegativeInteger } from "@/lib/shared/helpers/validators";

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
