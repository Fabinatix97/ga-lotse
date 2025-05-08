/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileDownload } from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { Formik } from "formik";

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
import {
  downloadFileAndOpen,
  useFileDownload,
} from "@eshg/lib-portal/api/files/download";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import { mapRequiredValue } from "@eshg/lib-portal/helpers/form";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

import { SCHOOL_OR_DAYCARE_CONTACT } from "../../../../config/contacts";
import { useDentalApi } from "../../../../contexts/dental";
import { useImportChildren } from "../../api/mutations/overview";

export function useImportChildrenSidebar(): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: ImportChildrenSidebar,
  });
}

interface ImportChildrenFormValues {
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

  const { childApi } = useDentalApi();
  const templateFile = useFileDownload(() =>
    childApi.getChildListTemplateRaw(),
  );

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {({}) => (
        <ImportDataForm
          title="Daten importieren"
          formRef={props.formRef}
          wasImportSuccessful={importSuccessful}
          importResult={importResult}
          onClose={props.onClose}
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
            <ButtonLink
              startDecorator={<FileDownload />}
              fontSize="sm"
              onClick={() => templateFile.download()}
            >
              Beispiel-Datei herunterladen
            </ButtonLink>
          </Stack>
        </ImportDataForm>
      )}
    </Formik>
  );
}
