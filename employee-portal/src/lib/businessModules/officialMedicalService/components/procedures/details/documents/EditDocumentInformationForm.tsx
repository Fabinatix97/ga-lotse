/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { theme } from "@/lib/baseModule/theme/theme";
import { DocumentFormValues } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentForm";
import { SwitchField } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/SwitchField";
import { HorizontalFieldLabelEnd } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/HorizontalFieldLabelEnd";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";

interface EditDocumentInformationFormProps {
  initialValues: DocumentFormValues;
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: DocumentFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function EditDocumentInformationForm(
  props: Readonly<EditDocumentInformationFormProps>,
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
              <SwitchField
                name="mandatoryDocument"
                label="Pflichtdokument"
                sx={{
                  ".MuiFormLabel-root": {
                    fontSize: theme.typography["body-md"].fontSize,
                    fontWeight: theme.typography["body-md"].fontWeight,
                  },
                }}
                component={HorizontalFieldLabelEnd}
              />
              <SwitchField
                name="uploadInCitizenPortal"
                label="Upload durch Bürger:in"
                sx={{
                  ".MuiFormLabel-root": {
                    fontSize: theme.typography["body-md"].fontSize,
                    fontWeight: theme.typography["body-md"].fontWeight,
                  },
                }}
                component={HorizontalFieldLabelEnd}
              />
              <InputField
                name="documentTypeDe"
                label="Dokumentenart"
                required="Bitte geben Sie eine Dokumentenart an"
              />
              <InputField name="documentTypeEn" label="Dokumentenart (EN)" />
              <InputField name="helpTextDe" label="Hilfstext" />
              <InputField name="helpTextEn" label="Hilfstext (EN)" />
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
