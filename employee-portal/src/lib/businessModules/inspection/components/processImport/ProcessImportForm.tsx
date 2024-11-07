/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DownloadLink } from "@eshg/lib-portal/api/files/DownloadLink";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FileDownload } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import { useImportApi } from "@/lib/businessModules/inspection/api/clients";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
    <DownloadLink
      downloadContainerRef={templateFile.downloadContainerRef}
      startDecorator={<FileDownload />}
      fontSize="sm"
      onDownload={() => templateFile.download()}
      sx={{ justifyContent: "flex-start" }}
    >
      Beispiel-Datei herunterladen
    </DownloadLink>
  );
}
