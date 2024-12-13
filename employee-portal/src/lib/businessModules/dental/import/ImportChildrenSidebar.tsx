/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactCategory } from "@eshg/employee-portal-api/base";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { Formik } from "formik";

import { useImportChildren } from "@/lib/businessModules/dental/api/mutations/importApi";
import { SearchMultipleContactsField } from "@/lib/shared/components/formFields/SearchMultipleContactsField";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { SchoolYearField } from "@/lib/shared/components/formFields/schoolYear";
import { ImportDataForm } from "@/lib/shared/components/import/ImportDataForm";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useImportChildrenSidebar() {
  return useSidebarWithFormRef({
    component: ImportChildrenSidebar,
  });
}

export interface ImportChildrenFormValues {
  file: File | null;
  institutionId: OptionalFieldValue<string>;
  schoolYear: OptionalFieldValue<number>;
}

const INITIAL_VALUES: ImportChildrenFormValues = {
  file: null,
  institutionId: "",
  schoolYear: "",
};

function ImportChildrenSidebar(props: SidebarWithFormRefProps) {
  const {
    mutateAsync: importChildren,
    isSuccess: importSuccessful,
    data: importResult,
  } = useImportChildren();
  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={importChildren}>
      {({}) => (
        <ImportDataForm
          title="Daten importieren"
          formRef={props.formRef}
          onClose={props.onClose}
          wasImportSuccessful={importSuccessful}
          importResult={importResult}
        >
          <Stack spacing={2}>
            <SearchMultipleContactsField
              name="institutionId"
              label="Einrichtung"
              categories={new Set<ApiContactCategory>()
                .add(ApiContactCategory.School)
                .add(ApiContactCategory.Daycare)}
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
