/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddContact200Response } from "@eshg/employee-portal-api/base";
import { downloadFileAndOpen } from "@eshg/lib-portal/api/files/download";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { useRef } from "react";

import { SCHOOL_OR_DAYCARE } from "@/lib/baseModule/api/queries/contacts";
import { useImportChildren } from "@/lib/businessModules/dental/api/mutations/importApi";
import { SelectContactField } from "@/lib/shared/components/formFields/SelectContactField";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { SchoolYearField } from "@/lib/shared/components/formFields/schoolYear";
import { ImportDataForm } from "@/lib/shared/components/import/ImportDataForm";
import { getInstitutionOptionLabel } from "@/lib/shared/helpers/selectOptionMapper";
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
  const downloadContainerRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(values: ImportChildrenFormValues) {
    await importChildren(
      {
        file: mapRequiredValue(values.file),
        institution: mapRequiredValue(values.institution),
        schoolYear: mapRequiredValue(values.schoolYear),
      },
      {
        onSuccess: ({ file }) => {
          // Automatic download
          if (downloadContainerRef.current) {
            downloadFileAndOpen(file, downloadContainerRef.current);
          }
        },
      },
    );
  }

  return (
    <>
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
                categories={SCHOOL_OR_DAYCARE}
                required="Bitte eine Schule/Kita angeben."
                getOptionLabel={getInstitutionOptionLabel}
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
      <HiddenContainer ref={downloadContainerRef} />
    </>
  );
}
