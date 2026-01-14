/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { isEmpty } from "remeda";

import {
  OptionalFieldValue,
  SelectField,
  TextareaField,
  buildEnumOptions,
} from "@eshg/lib-portal";
import { ApiManualProgressEntryType } from "@eshg/lib-procedures-api";

import { FormButtonBar } from "../../../../components/form/FormButtonBar";
import { FileField } from "../../../../components/formFields/file/FileField";
import { SidebarActions } from "../../../drawer/components/SidebarActions";
import { SidebarContent } from "../../../drawer/components/SidebarContent";
import { SidebarForm } from "../../../drawer/components/SidebarForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "../../../drawer/hooks/useSidebarWithFormRef";
import { useCreateProgressEntry } from "../../api/mutations/progressEntry";
import {
  manualProgressEntryFileTypes,
  manualProgressEntryTypeNames,
} from "../../config/progressEntryTypes";
import { useProgressEntriesConfig } from "../../contexts/progressEntries";
import { hasFileField, hasKeyDocumentTypeField } from "../../utils/helper";
import { mapFormValuesToCreateProgressEntryRequest } from "../../utils/mapper";

export function useCreateProgressEntrySidebar(): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: CreateProgressEntrySidebar,
  });
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

function CreateProgressEntrySidebar(props: SidebarWithFormRefProps) {
  const { keyDocumentTypes, progressEntryApi } = useProgressEntriesConfig();
  const createProgressEntry = useCreateProgressEntry(progressEntryApi);

  async function handleSubmit(values: CreateProgressEntryFormValues) {
    await createProgressEntry.mutateAsync(
      mapFormValuesToCreateProgressEntryRequest(values),
      {
        onSuccess: () => props.onClose(true),
      },
    );
  }

  return (
    <Formik
      initialValues={EMPTY_CREATE_PROGRESS_ENTRY_VALUES}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <SidebarForm ref={props.formRef}>
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
              onCancel={() => props.onClose()}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function acceptedFileTypes(
  type: OptionalFieldValue<ApiManualProgressEntryType>,
) {
  if (isEmpty(type)) return undefined;
  return manualProgressEntryFileTypes[type];
}
