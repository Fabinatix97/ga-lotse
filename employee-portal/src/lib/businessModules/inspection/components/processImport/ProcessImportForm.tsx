/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { FileDownload } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import { useImportApi } from "@/lib/businessModules/inspection/api/clients";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";

export interface ProcessImportFormValues {
  file: File | null;
}

export interface ProcessImportFormProps {
  onSubmit: (values: ProcessImportFormValues) => Promise<void>;
  onClose: () => void;
}

const INITIAL_VALUES: ProcessImportFormValues = {
  file: null,
};

export function ProcessImportForm({
  onSubmit: handleSubmit,
  onClose: handleClose,
}: Readonly<ProcessImportFormProps>) {
  return (
    <Formik onSubmit={handleSubmit} initialValues={INITIAL_VALUES}>
      {({ isSubmitting }) => (
        <SidebarForm>
          <SidebarContent title="Daten importieren">
            <Stack gap={2}>
              <FileField
                label="Wählen Sie eine XLSX-Datei aus"
                name="file"
                required="Datei ist erforderlich"
                accept={FileType.Xlsx}
              />
              <DownloadTemplateButton />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <ButtonBar
              right={
                <>
                  <Button onClick={handleClose} variant="soft" color="neutral">
                    Abbrechen
                  </Button>
                  <SubmitButton submitting={isSubmitting}>
                    Importieren
                  </SubmitButton>
                </>
              }
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function DownloadTemplateButton() {
  const importApi = useImportApi();
  const templateFile = useFileDownload(() =>
    importApi.getInspectionImportTemplateRaw(),
  );

  return (
    <ButtonLink
      startDecorator={<FileDownload />}
      fontSize="sm"
      onClick={() => templateFile.download()}
      sx={{ justifyContent: "flex-start" }}
    >
      Beispiel-Datei herunterladen
    </ButtonLink>
  );
}
