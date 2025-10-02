/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref, useEffect } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { InputField, useFocus } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { DocumentFormValues } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentForm";
import { SwitchField } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/SwitchField";
import { HorizontalFieldLabelEnd } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/HorizontalFieldLabelEnd";

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
  const { ref, focus } = useFocus();
  useEffect(() => {
    focus();
  }, [focus]);

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <SwitchField
                ref={(el) => (ref.current = el)}
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
              <InputField name="labCode" label="Labortest-Barcode" />
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
