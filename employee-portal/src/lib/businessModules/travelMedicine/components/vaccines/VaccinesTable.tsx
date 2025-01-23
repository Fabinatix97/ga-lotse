/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { useDeleteVaccine } from "@/lib/businessModules/travelMedicine/api/mutations/vaccines";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import {
  useGetAllVaccinesQuery,
  useGetUnusedInventoryVaccinesQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccines";
import { useVaccineSidebar } from "@/lib/businessModules/travelMedicine/components/vaccines/VaccineSidebar";
import { columns } from "@/lib/businessModules/travelMedicine/components/vaccines/columns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";

export function VaccinesTable() {
  const [
    { data: allVaccines },
    { data: unusedInventoryVaccines },
    { data: allDiseases },
  ] = useSuspenseQueries({
    queries: [
      useGetAllVaccinesQuery(),
      useGetUnusedInventoryVaccinesQuery(),
      useGetAllDiseasesQuery(),
    ],
  });

  const vaccineSidebar = useVaccineSidebar();

  const deleteVaccine = useDeleteVaccine();

  const { openConfirmationDialog } = useConfirmationDialog();

  async function deleteEntry(entryId: string) {
    await deleteVaccine.mutateAsync(entryId);
  }

  function deleteVaccineWithConfirmation(entryId: string, vaccineName: string) {
    openConfirmationDialog({
      title: `${vaccineName} löschen?`,
      description: `Diese Aktion kann nicht rückgängig gemacht werden.`,
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: async () => deleteEntry(entryId),
      color: "danger",
    });
  }

  return (
    <>
      <TablePage
        controls={
          <ButtonBar
            right={
              <Button
                startDecorator={<AddIcon />}
                onClick={() =>
                  vaccineSidebar.open({
                    vaccine: undefined,
                    unusedInventoryVaccines:
                      unusedInventoryVaccines.inventoryVaccineWithoutRmbiVaccineList,
                    allDiseases: allDiseases,
                  })
                }
              >
                Impfstoff hinzufügen
              </Button>
            }
          />
        }
      >
        <TableSheet>
          <DataTable
            data={allVaccines}
            columns={columns({
              deleteEntry: deleteVaccineWithConfirmation,
              editEntry: (vaccine) =>
                vaccineSidebar.open({
                  vaccine: vaccine,
                  unusedInventoryVaccines:
                    unusedInventoryVaccines.inventoryVaccineWithoutRmbiVaccineList,
                  allDiseases: allDiseases,
                }),
            })}
          />
        </TableSheet>
      </TablePage>
    </>
  );
}
