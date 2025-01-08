/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { Button, List, ListItem, Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import { DownloadTemplateLink } from "@/lib/businessModules/medicalRegistry/components/procedures/import/DownloadTemplateLink";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface ImportDataFormSidebarProps {
  onClose: () => void;
}

export function ImportDataFormSidebar({ onClose }: ImportDataFormSidebarProps) {
  const { isSubmitting } = useFormikContext();

  return (
    <SidebarForm>
      <SidebarContent title="Daten importieren">
        <Stack gap={3}>
          <Alert
            color="primary"
            title="Hinweis"
            message={
              <List
                marker="disc"
                sx={{
                  "&, && > *": { color: "inherit" },
                  paddingInlineStart: "2ch",
                  "--List-padding": 0,
                  "--ListItem-minHeight": "2rem",
                }}
              >
                <ListItem>
                  Der Import kann nicht rückgängig gemacht werden.
                </ListItem>
                <ListItem>Alle Pflichtfelder müssen ausgefüllt sein.</ListItem>
                <ListItem>Daten-Duplikate sind zu vermeiden.</ListItem>
                <ListItem>
                  Die Datei darf maximal 4000 Einträge enthalten.
                </ListItem>
              </List>
            }
          />
          <Alert
            color="danger"
            title="Mehrfachupload vermeiden"
            message="Datensätze dürfen nicht mehrfach hochgeladen werden."
          />
          <Stack gap={2}>
            <FileField
              name="importFile"
              label="Wählen Sie eine XLSX-Datei aus"
              required="Bitte eine XLSX-Datei auswählen."
              accept={FileType.Xlsx}
            />
            <DownloadTemplateLink />
          </Stack>
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
