/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";
import { useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { isEmpty } from "remeda";

import {
  ButtonBar,
  DataTable,
  TablePage,
  TableSheet,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { ApiDisease } from "@eshg/travel-medicine-api";

import { useDiseaseApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useDeleteDisease } from "@/lib/businessModules/travelMedicine/api/mutations/diseaseApi";
import {
  getAllDiseasesInUse,
  useGetAllDiseasesQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useDiseaseSidebar } from "@/lib/businessModules/travelMedicine/components/diseases/DiseaseSidebar";
import { columns } from "@/lib/businessModules/travelMedicine/components/diseases/columns";

export function DiseasesTable() {
  const queryClient = useQueryClient();
  const diseaseApi = useDiseaseApi();
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

  async function deleteDiseaseWithConfirmation(
    entryId: string,
    diseaseName: string,
  ) {
    const result = await getAllDiseasesInUse(queryClient, diseaseApi, entryId);

    if (isEmpty(result.vaccineNames)) {
      openConfirmationDialog({
        title: `${diseaseName} löschen?`,
        description: `Diese Aktion kann nicht rückgängig gemacht werden.`,
        confirmLabel: "Löschen",
        cancelLabel: "Abbrechen",
        onConfirm: () => deleteEntry(entryId),
        color: "danger",
      });
    } else {
      openConfirmationDialog({
        title: `${diseaseName} kann nicht gelöscht werden`,
        description: `Die Krankheit wird noch in folgenden Impfstoffen referenziert: ${result.vaccineNames.join(", ")}`,
        confirmLabel: "Verstanden",
        hideCancelButton: true,
        color: "danger",
        onConfirm: () => undefined,
      });
    }
  }

  return (
    <TablePage
      data-testid="diseases"
      controls={
        <ButtonBar
          right={
            <Button
              autoFocus
              startDecorator={<AddIcon />}
              onClick={() => newEntry()}
            >
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
  );
}
