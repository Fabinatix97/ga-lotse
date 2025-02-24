/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiCreateTextTemplateRequest,
  ApiTextTemplate,
} from "@eshg/sti-protection-api";
import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/joy";
import { useState } from "react";

import {
  useCreateTextTemplate,
  useDeleteTextTemplate,
  useUpdateTextTemplate,
} from "@/lib/businessModules/stiProtection/api/mutations/textTemplates";
import { useTextTemplates } from "@/lib/businessModules/stiProtection/api/queries/textTemplates";
import { EmployeePortalConfirmationDialog } from "@/lib/shared/components/confirmationDialog/EmployeePortalConfirmationDialog";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { TextTemplateEditSidebar } from "./TextTemplateEditSidebar";
import { textTemplateColumns } from "./TextTemplatesOverviewTableColumns";

export function TextTemplatesOverviewTable() {
  const [sidebarOpenId, setSidebarOpenId] = useSearchParam("edit", "string");
  const [isNewSidebarOpen, setNewSidebarOpen] = useSearchParam(
    "new",
    "boolean",
  );
  const [confirmingDelete, setConfirmingDelete] = useState<
    string | undefined
  >();
  const snackbar = useSnackbar();

  const addMutation = useCreateTextTemplate({
    onSuccess: () => {
      snackbar.confirmation("Die Vorlage wurde erzeugt.");
    },
  });
  const updateMutation = useUpdateTextTemplate({
    onSuccess: () => {
      snackbar.confirmation("Der Vorlage wurde aktualisiert.");
    },
  });
  const deleteMutation = useDeleteTextTemplate({
    onSuccess: () => {
      snackbar.confirmation("Die Vorlage wurde gelöscht.");
    },
  });

  const { data: textTemplates } = useTextTemplates();
  const selectedTemplate = textTemplates.find(
    (t) => t.externalId === sidebarOpenId,
  );

  async function onUpdate(data: ApiTextTemplate) {
    await updateMutation.mutateAsync(data);
    setSidebarOpenId(null);
  }

  async function onCreate(data: ApiCreateTextTemplateRequest) {
    await addMutation.mutateAsync(data);
    setNewSidebarOpen(false);
  }

  async function deleteTemplate() {
    if (confirmingDelete == null) {
      return;
    }
    await deleteMutation.mutateAsync(confirmingDelete);
    setConfirmingDelete(undefined);
  }

  return (
    <Stack gap={3}>
      <Button
        sx={{ alignSelf: "end" }}
        startDecorator={<Add />}
        onClick={() => setNewSidebarOpen(true)}
      >
        Vorlage hinzufügen
      </Button>
      <TableSheet aria-label="Tabelle der Textvorlagen">
        <DataTable
          data={textTemplates}
          columns={textTemplateColumns({
            onEdit: ({ externalId }) => setSidebarOpenId(externalId),
            onDelete: ({ externalId }) => setConfirmingDelete(externalId),
          })}
        />
      </TableSheet>
      <EmployeePortalConfirmationDialog
        open={confirmingDelete != null}
        title="Vorlage löschen?"
        description={`Möchten Sie die Vorlage ${textTemplates.find((template) => template.externalId == confirmingDelete)?.name} wirklich löschen? Die Aktion kann nicht rückgängig gemacht werden.`}
        confirmLabel="Löschen"
        color="danger"
        onCancel={() => {
          setConfirmingDelete(undefined);
        }}
        onClose={() => {
          setConfirmingDelete(undefined);
        }}
        onConfirm={deleteTemplate}
      />
      <TextTemplateEditSidebar
        title={"Vorlage bearbeiten"}
        isOpen={sidebarOpenId != null}
        initialValues={selectedTemplate}
        onClose={() => setSidebarOpenId(null)}
        onUpdate={onUpdate}
      />
      <TextTemplateEditSidebar
        title={"Vorlage hinzufügen"}
        isOpen={isNewSidebarOpen}
        onCreate={onCreate}
        onClose={() => setNewSidebarOpen(false)}
      />
    </Stack>
  );
}
