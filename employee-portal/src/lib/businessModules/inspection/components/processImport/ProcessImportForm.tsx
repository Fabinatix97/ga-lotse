/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileDownload } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import {
  ButtonBar,
  FileField,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";

import { useImportApi } from "@/lib/businessModules/inspection/api/clients";

export interface ProcessImportFormValues {
  file: File | null;
}

interface ProcessImportFormProps {
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
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
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
                  <Button variant="soft" color="neutral" onClick={handleClose}>
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
      sx={{ justifyContent: "flex-start" }}
      onClick={() => templateFile.download()}
    >
      Beispiel-Datei herunterladen
    </ButtonLink>
  );
}
