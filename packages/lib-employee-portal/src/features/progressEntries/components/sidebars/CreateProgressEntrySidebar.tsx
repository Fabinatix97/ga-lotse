/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { isEmpty } from "remeda";

import {
  OptionalFieldValue,
  SelectField,
  TextareaField,
  buildEnumOptions,
} from "@eshg/lib-portal";
import { ApiManualProgressEntryType } from "@eshg/lib-procedures-api";

import { OverlayBoundary } from "../../../../components/boundaries/OverlayBoundary";
import { FormButtonBar } from "../../../../components/form/FormButtonBar";
import { FileField } from "../../../../components/formFields/file/FileField";
import { useConfirmationDialog } from "../../../../hooks/useConfirmationDialog";
import { Sidebar } from "../../../drawer/components/Sidebar";
import { SidebarActions } from "../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../drawer/components/SidebarContent";
import { SidebarForm } from "../../../drawer/components/SidebarForm";
import { useCreateProgressEntry } from "../../api/mutations/progressEntry";
import {
  manualProgressEntryFileTypes,
  manualProgressEntryTypeNames,
} from "../../config/progressEntryTypes";
import { useProgressEntriesConfig } from "../../contexts/progressEntries";
import { hasFileField, hasKeyDocumentTypeField } from "../../utils/helper";
import { mapFormValuesToCreateProgressEntryRequest } from "../../utils/mapper";

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
  const { keyDocumentTypes, progressEntryApi } = useProgressEntriesConfig();
  const createProgressEntry = useCreateProgressEntry(progressEntryApi);
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
                  label="Typ"
                  name="type"
                  options={buildEnumOptions(manualProgressEntryTypeNames)}
                  required="Bitte einen Typ auswählen."
                />
                {hasFileField(values.type) && (
                  <>
                    <FileField
                      name="file"
                      label="Datei hochladen"
                      accept={acceptedFileTypes(values.type)}
                      required="Bitte eine Datei auswählen."
                    />
                    <TextareaField
                      name="documentDescription"
                      label="Dateibeschreibung"
                    />
                  </>
                )}
                {hasKeyDocumentTypeField(values.type) && (
                  <SelectField
                    label="Dokumenttyp"
                    name="keyDocumentType"
                    options={[
                      {
                        value: "",
                        label: "",
                      },
                    ].concat(buildEnumOptions(keyDocumentTypes))}
                  />
                )}
                <TextareaField name="text" label="Text" />
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
