/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { Button, Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import { DownloadTemplateLink } from "@/lib/businessModules/medicalRegistry/components/procedures/import/DownloadTemplateLink";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface ImportDataFormSidebarProps {
  onClose: () => void;
}

export function ImportDataFormSidebar({ onClose }: ImportDataFormSidebarProps) {
  const { isSubmitting } = useFormikContext();
  return (
    <SidebarForm>
      <SidebarContent
        title="Daten importieren"
        alert={{
          color: "primary",
          title: "Hinweis",
          message:
            "Der Import kann nicht rückgängig gemacht werden. Bitte achten sie darauf, dass alle Pflichtfelder gesetzt sind und dass keine Duplikate enthalten sind.",
        }}
      >
        <Stack gap={2}>
          <FileField
            name="importFile"
            label="Wählen Sie eine XLSX-Datei aus"
            required="Bitte eine XLSX-Datei auswählen."
            accept={FileType.Xlsx}
          />
          <DownloadTemplateLink />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <>
              <Button onClick={() => onClose()} variant="soft" color="neutral">
                Abbrechen
              </Button>
              <SubmitButton submitting={isSubmitting}>Importieren</SubmitButton>
            </>
          }
        />
      </SidebarActions>
    </SidebarForm>
  );
}
