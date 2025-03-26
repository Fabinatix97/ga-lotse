/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ButtonBar,
  DataTable,
  TablePage,
  TableSheet,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { ApiDisease } from "@eshg/travel-medicine-api";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useDeleteDisease } from "@/lib/businessModules/travelMedicine/api/mutations/diseaseApi";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useDiseaseSidebar } from "@/lib/businessModules/travelMedicine/components/diseases/DiseaseSidebar";
import { columns } from "@/lib/businessModules/travelMedicine/components/diseases/columns";

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
