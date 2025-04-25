/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik, FormikHelpers } from "formik";
import { isEmpty } from "remeda";

import {
  FileField,
  FormButtonBar,
  OverlayBoundary,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  TextareaField,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { ApiManualProgressEntryType } from "@eshg/lib-procedures-api";

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
import { useCreateProgressEntry } from "@/lib/shared/components/procedures/progress-entries/mutations/progressEntryApi";

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
