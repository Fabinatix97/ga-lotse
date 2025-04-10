/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ButtonBar,
  FileField,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FileType } from "@eshg/lib-portal/components/formFields/file/types";
import { Button, List, ListItem, Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import { DownloadTemplateLink } from "@/lib/businessModules/medicalRegistry/components/procedures/import/DownloadTemplateLink";

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
            color="danger"
            title="Duplikate vermeiden"
            message={
              <List
                marker="disc"
                size="md"
                sx={{
                  "&, && > *": { color: "inherit" },
                  paddingInlineStart: "2ch",
                  "--List-padding": 0,
                  "--ListItem-minHeight": "1.5rem",
                  "--ListItem-paddingX": 0,
                  "--ListItem-paddingY": 0,
                }}
              >
                <ListItem>Laden Sie Datensätze nicht mehrfach hoch.</ListItem>
                <ListItem>
                  Vermeiden Sie Duplikate von Bestandsdaten sowie innerhalb der
                  XLSX-Datei.
                </ListItem>
              </List>
            }
          />
          <Stack gap={2}>
            <FileField
              name="importFile"
              label="XLSX-Datei auswählen (Max. 4000 Einträge)"
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
