/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddContact200Response } from "@eshg/base-api";
import {
  FileField,
  ImportDataForm,
  SchoolYearField,
  SelectContactField,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  formatInstitutionNameWithCategoryShort,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { Formik } from "formik";

import { SCHOOL_OR_DAYCARE_CONTACT } from "@/config/contacts";
import { useImportChildren } from "@/features/children/api/mutations/overview";

export function useImportChildrenSidebar(): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: ImportChildrenSidebar,
  });
}

export interface ImportChildrenFormValues {
  file: File | null;
  institution: ApiAddContact200Response | null;
  schoolYear: OptionalFieldValue<number>;
}

const INITIAL_VALUES: ImportChildrenFormValues = {
  file: null,
  institution: null,
  schoolYear: "",
};

function ImportChildrenSidebar(props: SidebarWithFormRefProps) {
  const {
    mutateAsync: importChildren,
    isSuccess: importSuccessful,
    data: importResult,
  } = useImportChildren();
  async function handleSubmit(values: ImportChildrenFormValues) {
    await importChildren(
      {
        file: mapRequiredValue(values.file),
        institutionId: mapRequiredValue(values.institution).id,
        schoolYear: mapRequiredValue(values.schoolYear),
      },
      {
        onSuccess: ({ file }) => {
          // Automatic download
          downloadFileAndOpen(file);
        },
      },
    );
  }

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({}) => (
        <ImportDataForm
          title="Daten importieren"
          formRef={props.formRef}
          onClose={props.onClose}
          wasImportSuccessful={importSuccessful}
          importResult={importResult}
        >
          <Stack spacing={2}>
            <SelectContactField
              name="institution"
              label="Einrichtung"
              categories={SCHOOL_OR_DAYCARE_CONTACT}
              placeholder="Schule/Kita suchen"
              required="Bitte eine Schule/Kita angeben."
              getOptionLabel={formatInstitutionNameWithCategoryShort}
            />
            <SchoolYearField
              name="schoolYear"
              label="Wählen Sie ein Schuljahr aus"
              required="Bitte ein Schuljahr auswählen."
              range={{
                numberOfYearsInPast: 1,
                numberOfYearsInFuture: 0,
              }}
            />
            <FileField
              name="file"
              label="Wählen Sie eine XLSX-Datei aus"
              accept={FileType.Xlsx}
              required="Bitte eine Datei auswählen."
            />
          </Stack>
        </ImportDataForm>
      )}
    </Formik>
  );
}
