/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiDisease } from "@eshg/employee-portal-api/travelMedicine";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useDeleteDisease } from "@/lib/businessModules/travelMedicine/api/mutations/diseaseApi";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useDiseaseSidebar } from "@/lib/businessModules/travelMedicine/components/diseases/DiseaseSidebar";
import { columns } from "@/lib/businessModules/travelMedicine/components/diseases/columns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function DiseasesTable() {
  const [{ data: allDiseases }] = useSuspenseQueries({
    queries: [useGetAllDiseasesQuery()],
  });

  const diseaseSidebar = useDiseaseSidebar();
  const deleteDisease = useDeleteDisease();

  const { openConfirmationDialog } = useConfirmationDialog();

  function newEntry() {
    diseaseSidebar.open({ disease: undefined });
  }

  function editEntry(disease: ApiDisease) {
    diseaseSidebar.open({ disease: disease });
  }

  async function deleteEntry(entryId: string) {
    await deleteDisease.mutateAsync(entryId);
  }

  function deleteDiseaseWithConfirmation(entryId: string, diseaseName: string) {
    openConfirmationDialog({
      title: `${diseaseName} löschen?`,
      description: `Diese Aktion kann nicht rückgängig gemacht werden.`,
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: () => deleteEntry(entryId),
      color: "danger",
    });
  }

  return (
    <>
      <TablePage
        data-testid="diseases"
        controls={
          <ButtonBar
            right={
              <Button startDecorator={<AddIcon />} onClick={() => newEntry()}>
                Krankheit hinzufügen
              </Button>
            }
          />
        }
      >
        <TableSheet>
          <DataTable
            data={allDiseases}
            columns={columns(deleteDiseaseWithConfirmation, editEntry)}
          />
        </TableSheet>
      </TablePage>
    </>
  );
}
