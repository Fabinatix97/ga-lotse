/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiPostPutVaccineRequest,
  ApiTravelMedicineFeature,
  ApiVaccine,
} from "@eshg/employee-portal-api/travelMedicine";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { FormikProps } from "formik";
import { useRef, useState } from "react";

import {
  useDeleteVaccine,
  usePostVaccine,
  usePutVaccine,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccines";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureToggles";
import {
  useGetAllVaccinesQuery,
  useGetUnusedInventoryVaccinesQuery,
} from "@/lib/businessModules/travelMedicine/api/queries/vaccines";
import {
  EditVaccineContent,
  VaccineFormData,
} from "@/lib/businessModules/travelMedicine/components/vaccines/EditVaccineContent";
import { vaccinesColumns } from "@/lib/businessModules/travelMedicine/components/vaccines/columns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export function VaccinesOverviewTable() {
  const [
    { data: tableData },
    { data: inventoryVaccines },
    { data: allDiseases },
  ] = useSuspenseQueries({
    queries: [
      useGetAllVaccinesQuery(),
      useGetUnusedInventoryVaccinesQuery(),
      useGetAllDiseasesQuery(),
    ],
  });
  const defaultBatchIdEnabled = useIsNewFeatureEnabled(
    ApiTravelMedicineFeature.DefaultBatchId,
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentVaccine, setCurrentVaccine] = useState<ApiVaccine>();

  const formikRef = useRef<FormikProps<VaccineFormData>>(null);
  const { openConfirmationDialog } = useConfirmationDialog();

  const resetAlertContext = useResetAlertContext();

  function updateSidebarAndVaccine(
    sideBarState: boolean,
    vaccine?: ApiVaccine,
  ) {
    setSidebarOpen(sideBarState);
    setCurrentVaccine(vaccine);
    resetAlertContext();
  }

  function sidebarTitle(): string {
    return currentVaccine ? "Impfstoff bearbeiten" : "Impfstoff hinzufügen";
  }

  function getSubmitButtonLabel() {
    return currentVaccine ? "Speichern" : "Hinzufügen";
  }

  const createVaccine = usePostVaccine();

  const updateVaccine = usePutVaccine();

  const deleteVaccine = useDeleteVaccine();

  function initialValues(): VaccineFormData {
    return {
      name: currentVaccine?.name ?? "",
      diseaseId: currentVaccine?.disease.id ?? "",
      fee: currentVaccine?.fee ?? 0.0,
      inventoryVaccineId: currentVaccine?.inventoryVaccineId ?? "",
      offsets: currentVaccine?.offsets ?? [],
      currentBatchId: currentVaccine?.currentBatchId ?? "",
      loadings: {
        currentInventoryVaccineId:
          currentVaccine?.inventoryVaccineId ?? undefined,
        diseases: allDiseases.diseases,
        inventoryVaccines:
          inventoryVaccines.inventoryVaccineWithoutRmbiVaccineList,
      },
    };
  }

  function closeAndCleanSidebarForm() {
    updateSidebarAndVaccine(false);
    formikRef.current?.resetForm();
  }

  function newEntry() {
    updateSidebarAndVaccine(true);
  }

  function editEntry(vaccine: ApiVaccine) {
    updateSidebarAndVaccine(true, vaccine);
  }

  async function deleteEntry(entryId: string) {
    await deleteVaccine.mutateAsync(entryId);
  }

  function deleteVaccineWithConfirmation(entryId: string, vaccineName: string) {
    openConfirmationDialog({
      title: `${vaccineName} löschen?`,
      description: `Möchten Sie ${vaccineName} wirklich löschen?`,
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: async () => deleteEntry(entryId),
      color: "danger",
    });
  }

  async function doSubmit(values: VaccineFormData) {
    const request: ApiPostPutVaccineRequest = {
      name: values.name,
      diseaseId: values.diseaseId,
      inventoryVaccineId: values.inventoryVaccineId,
      fee: values.fee,
      offsets: values.offsets,
      currentBatchId: defaultBatchIdEnabled ? values.currentBatchId : undefined,
    };
    if (currentVaccine) {
      await updateVaccine.mutateAsync({
        id: currentVaccine.id,
        values: request,
      });
    } else {
      await createVaccine.mutateAsync(request);
    }
    closeAndCleanSidebarForm();
  }

  function doCancel() {
    closeAndCleanSidebarForm();
  }

  return (
    <>
      <TablePage
        controls={
          <ButtonBar
            right={
              <Button startDecorator={<AddIcon />} onClick={() => newEntry()}>
                Impfstoff hinzufügen
              </Button>
            }
          />
        }
      >
        <TableSheet>
          <DataTable
            data={tableData.vaccines}
            columns={vaccinesColumns(
              deleteVaccineWithConfirmation,
              editEntry,
              defaultBatchIdEnabled,
            )}
          />
        </TableSheet>
      </TablePage>

      <Sidebar open={sidebarOpen} onClose={closeAndCleanSidebarForm}>
        <EditVaccineContent
          initialValues={initialValues}
          getSubmitButtonLabel={getSubmitButtonLabel}
          onSubmit={doSubmit}
          onCancel={doCancel}
          title={sidebarTitle}
          defaultBatchIdEnabled={defaultBatchIdEnabled}
        />
      </Sidebar>
    </>
  );
}
