/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  ButtonBar,
  DataTable,
  TablePage,
  TableSheet,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiPostPutOtherServiceTemplateRequest } from "@eshg/travel-medicine-api";

import {
  useAddOtherServiceTemplate,
  useDeleteOtherServiceTemplate,
  useUpdateOtherServiceTemplate,
} from "@/lib/businessModules/travelMedicine/api/mutations/otherServiceTemplates";
import { useGetAllOtherServiceTemplatesQuery } from "@/lib/businessModules/travelMedicine/api/queries/otherServiceTemplates";
import { useOtherServiceSidebar } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/OtherServiceSidebar";
import { otherServiceTemplatesColumns } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/columns";

export function OtherServiceTable() {
  const snackbar = useSnackbar();
  const { openConfirmationDialog } = useConfirmationDialog();

  const createOtherServiceTemplateMutation = useAddOtherServiceTemplate();
  const updateOtherServiceTemplateMutation = useUpdateOtherServiceTemplate();
  const deleteOtherServiceTemplateMutation = useDeleteOtherServiceTemplate();

  const otherServiceSidebar = useOtherServiceSidebar();

  const [{ data: allOtherServiceTemplates }] = useSuspenseQueries({
    queries: [useGetAllOtherServiceTemplatesQuery()],
  });

  async function createOtherServiceTemplate(
    request: ApiPostPutOtherServiceTemplateRequest,
    onSuccess?: () => void,
  ) {
    await createOtherServiceTemplateMutation.mutateAsync(request, {
      onSuccess: () => {
        snackbar.confirmation("Die Leistung wurde angelegt.");
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  }

  async function updateOtherServiceTemplate(
    id: string,
    request: ApiPostPutOtherServiceTemplateRequest,
    onSuccess?: () => void,
  ) {
    await updateOtherServiceTemplateMutation.mutateAsync(
      { id, request },
      {
        onSuccess: () => {
          snackbar.confirmation("Die Leistung wurde gespeichert.");
          if (onSuccess) {
            onSuccess();
          }
        },
      },
    );
  }

  async function deleteOtherServiceTemplate(id: string) {
    await deleteOtherServiceTemplateMutation.mutateAsync(id, {
      onSuccess: () => {
        snackbar.confirmation("Die Leistung wurde gelöscht.");
      },
    });
  }

  function deleteEntry(entryId: string) {
    openConfirmationDialog({
      title: `Leistung löschen?`,
      description: `Diese Aktion kann nicht rückgängig gemacht werden.`,
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: () => deleteOtherServiceTemplate(entryId),
      color: "danger",
    });
  }

  return (
    <TablePage
      controls={
        <ButtonBar
          right={
            <Button
              startDecorator={<AddIcon />}
              onClick={() =>
                otherServiceSidebar.open({
                  otherService: undefined,
                  createOtherServiceTemplate: createOtherServiceTemplate,
                  updateOtherServiceTemplate: updateOtherServiceTemplate,
                })
              }
            >
              Leistung hinzufügen
            </Button>
          }
        />
      }
    >
      <TableSheet>
        <DataTable
          data={allOtherServiceTemplates}
          columns={otherServiceTemplatesColumns({
            editEntry: (otherService) =>
              otherServiceSidebar.open({
                otherService: otherService,
                createOtherServiceTemplate: createOtherServiceTemplate,
                updateOtherServiceTemplate: updateOtherServiceTemplate,
              }),
            deleteEntry: deleteEntry,
          })}
        />
      </TableSheet>
    </TablePage>
  );
}
