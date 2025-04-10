/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { DocumentFormValues } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentForm";

interface EditDocumentNoteFormProps {
  initialValues: DocumentFormValues;
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: DocumentFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}
export function EditDocumentNoteForm(
  props: Readonly<EditDocumentNoteFormProps>,
) {
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
              <InputField name="note" label="Stichwörter" />
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
