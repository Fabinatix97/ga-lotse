/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { RadioGroupField } from "@eshg/lib-portal/components/formFields/RadioGroupField";
import Delete from "@mui/icons-material/Delete";
import { Divider, IconButton, Radio, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { Ref } from "react";
import { isDefined } from "remeda";

import { theme } from "@/lib/baseModule/theme/theme";
import { FilesSection } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/FilesSection";
import { SwitchField } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/SwitchField";
import { HorizontalFieldLabelEnd } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/HorizontalFieldLabelEnd";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface AddDocumentFormValues {
  documentTypeDe: string;
  documentTypeEn?: string;
  helpTextDe?: string;
  helpTextEn?: string;
  mandatoryDocument: boolean;
  uploadInCitizenPortal: boolean;
  files?: File[];
  note?: string;
  upload?: string;
}

interface AddDocumentFormProps {
  initialValues: AddDocumentFormValues;
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: AddDocumentFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function AddDocumentForm(props: Readonly<AddDocumentFormProps>) {
  async function handleChange(
    values: AddDocumentFormValues,
    newType: string,
    setFieldValue: (
      field: string,
      value: boolean | File[] | string,
    ) => Promise<void | FormikErrors<AddDocumentFormValues>>,
    setFieldTouched: (
      field: string,
      isTouched: boolean,
      shouldValidate: boolean,
    ) => Promise<void | FormikErrors<AddDocumentFormValues>>,
  ) {
    await setFieldTouched("uploadInCitizenPortal", true, false);
    if (isDefined(values.files) && values.files.length >= 1) {
      await setFieldValue("files", []);
    }
    if (newType === "citizen") {
      await setFieldValue("uploadInCitizenPortal", true);
      await setFieldValue("note", "");
      return;
    }
    if (newType === "later") {
      await setFieldValue("uploadInCitizenPortal", false);
      await setFieldValue("note", "");
      return;
    }
    if (newType === "now") {
      await setFieldValue("uploadInCitizenPortal", false);
    }
  }

  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, values, setFieldValue, setFieldTouched }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={4}>
              <Typography level={"title-md"}>Angaben zum Dokument</Typography>
              <Stack direction="column" gap={1}>
                <InputField
                  name="documentTypeDe"
                  label="Dokumentenart"
                  required="Bitte geben Sie eine Dokumentenart an"
                />
                {isDefined(values.documentTypeEn) ? (
                  <InputField
                    name="documentTypeEn"
                    label="Dokumentenart (EN)"
                    endDecorator={
                      <IconButton
                        color="danger"
                        aria-label="Dokumentenart (EN) entfernen"
                        onClick={async () => {
                          await setFieldValue("documentTypeEn", undefined);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    }
                  />
                ) : (
                  <FormAddMoreButton
                    onClick={() => setFieldValue("documentTypeEn", "", false)}
                    aria-label="Dokument Übersetzen"
                  >
                    Übersetzung ergänzen
                  </FormAddMoreButton>
                )}
              </Stack>
              <Stack direction="column" gap={1}>
                <InputField name="helpTextDe" label="Hilfstext" />
                {isDefined(values.helpTextEn) ? (
                  <InputField
                    name="helpTextEn"
                    label="Hilfstext (EN)"
                    endDecorator={
                      <IconButton
                        color="danger"
                        aria-label="Hilfstext (EN) entfernen"
                        onClick={async () => {
                          await setFieldValue("helpTextEn", undefined);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    }
                  />
                ) : (
                  <FormAddMoreButton
                    onClick={() => setFieldValue("helpTextEn", "", false)}
                    aria-label="Hilfstext Übersetzen"
                  >
                    Übersetzung ergänzen
                  </FormAddMoreButton>
                )}
              </Stack>
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
              <Divider orientation="horizontal" />
              <Stack direction="column" gap={2}>
                <RadioGroupField
                  name="upload"
                  label="Dateien"
                  sx={{
                    ".MuiFormLabel-root": {
                      fontSize: theme.typography["title-md"].fontSize,
                      fontWeight: theme.typography["title-md"].fontWeight,
                      pb: theme.spacing(2),
                    },
                  }}
                  onChange={async (newType) =>
                    await handleChange(
                      values,
                      newType,
                      setFieldValue,
                      setFieldTouched,
                    )
                  }
                >
                  <Stack direction="column" gap={4}>
                    <Radio value="citizen" label="Upload durch Bürger:in" />
                    <Radio value="later" label="Dateien später hochladen" />
                    <Radio value="now" label="Dateien jetzt hochladen" />
                  </Stack>
                </RadioGroupField>
                {values.upload === "now" && (
                  <Stack gap={2}>
                    <FilesSection
                      name="files"
                      canAdd={true}
                      withInitialField={true}
                      addLabel="Weitere Datei hochladen"
                    />
                    <InputField name="note" label="Stichwörter" />
                  </Stack>
                )}
              </Stack>
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
