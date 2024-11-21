/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ApiManualProgressEntryType } from "@eshg/employee-portal-api/businessProcedures";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { isEmpty } from "remeda";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { useProgressEntriesConfig } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import {
  manualProgressEntryFileTypes,
  manualProgressEntryTypeNames,
} from "@/lib/shared/components/procedures/progress-entries/constants";
import {
  hasFileField,
  hasKeyDocumentTypeField,
} from "@/lib/shared/components/procedures/progress-entries/helper";
import { mapFormValuesToCreateProgressEntryRequest } from "@/lib/shared/components/procedures/progress-entries/mapper";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { validateFile } from "@/lib/shared/helpers/validators";

interface CreateProgressEntrySidebarProps {
  open: boolean;
  onClose: () => void;
}

export interface CreateProgressEntryFormValues {
  type: OptionalFieldValue<ApiManualProgressEntryType>;
  file: File | null;
  documentDescription: string;
  text: string;
  keyDocumentType: OptionalFieldValue<string>;
}

const EMPTY_CREATE_PROGRESS_ENTRY_VALUES: CreateProgressEntryFormValues = {
  type: "",
  file: null,
  documentDescription: "",
  text: "",
  keyDocumentType: "",
};

export function CreateProgressEntrySidebar(
  props: CreateProgressEntrySidebarProps,
) {
  return (
    <OverlayBoundary>
      <CreateProgressEntrySidebarContent {...props} />
    </OverlayBoundary>
  );
}

function CreateProgressEntrySidebarContent({
  open,
  onClose,
}: CreateProgressEntrySidebarProps) {
  const { keyDocumentTypes, useCreateProgressEntry } =
    useProgressEntriesConfig();
  const createProgressEntry = useCreateProgressEntry();
  const { openConfirmationDialog } = useConfirmationDialog();

  async function handleSubmit(
    values: CreateProgressEntryFormValues,
    helpers: FormikHelpers<CreateProgressEntryFormValues>,
  ) {
    await createProgressEntry.mutateAsync(
      mapFormValuesToCreateProgressEntryRequest(values),
      {
        onSuccess: () => {
          onClose();
          helpers.resetForm();
        },
      },
    );
  }

  function handleClose() {
    onClose();
  }

  return (
    <Sidebar open={open} onClose={handleClose}>
      <Formik
        initialValues={EMPTY_CREATE_PROGRESS_ENTRY_VALUES}
        onSubmit={handleSubmit}
        onReset={handleClose}
      >
        {({ isSubmitting, handleReset, handleSubmit, values }) => (
          <SidebarForm onSubmit={handleSubmit}>
            <SidebarContent title="Neuer Verlaufseintrag">
              <Stack spacing={3}>
                <SelectField
                  label={"Typ"}
                  name={"type"}
                  options={buildEnumOptions(manualProgressEntryTypeNames)}
                  required="Bitte einen Typ auswählen."
                />
                {hasFileField(values.type) && (
                  <>
                    <FileField
                      name={"file"}
                      label={"Datei hochladen"}
                      accept={acceptedFileTypes(values.type)}
                      required="Bitte eine Datei auswählen."
                      validate={validateFile(
                        acceptedFileTypes(values.type)?.flatMap(
                          (type) => type.extensions,
                        ),
                      )}
                    />
                    <TextareaField
                      name={"documentDescription"}
                      label={"Dateibeschreibung"}
                    />
                  </>
                )}
                {hasKeyDocumentTypeField(values.type) && (
                  <SelectField
                    label={"Dokumenttyp"}
                    name={"keyDocumentType"}
                    options={[
                      {
                        value: "",
                        label: "",
                      },
                    ].concat(buildEnumOptions(keyDocumentTypes))}
                  />
                )}
                <TextareaField name={"text"} label={"Text"} />
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel="Hinzufügen"
                submitting={isSubmitting}
                onCancel={() =>
                  openConfirmationDialog({
                    title: "Änderungen verwerfen?",
                    description:
                      "Möchten Sie die Änderungen wirklich verwerfen?",
                    confirmLabel: "Verwerfen",
                    onConfirm: () => handleReset(),
                  })
                }
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

function acceptedFileTypes(
  type: OptionalFieldValue<ApiManualProgressEntryType>,
) {
  if (isEmpty(type)) return undefined;
  return manualProgressEntryFileTypes[type];
}
