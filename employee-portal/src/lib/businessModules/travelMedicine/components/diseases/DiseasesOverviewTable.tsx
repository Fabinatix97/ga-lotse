/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiDisease,
  ApiPostPutDiseaseRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import AddIcon from "@mui/icons-material/Add";
import { Button, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRef, useState } from "react";

import {
  PutDiseaseRequest,
  useDeleteDisease,
  usePostDisease,
  usePutDisease,
} from "@/lib/businessModules/travelMedicine/api/mutations/diseaseApi";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { diseasesColumns } from "@/lib/businessModules/travelMedicine/components/diseases/columns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { validateNonNegativeNumberWithAtMostTwoDecimalDigits } from "@/lib/shared/helpers/validators";

export function DiseasesOverviewTable() {
  const [currentDisease, setCurrentDisease] = useState<ApiDisease>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [{ data: allDiseases }] = useSuspenseQueries({
    queries: [useGetAllDiseasesQuery()],
  });

  const postDisease = usePostDisease();
  const putDisease = usePutDisease();
  const deleteDisease = useDeleteDisease();

  const resetAlertContext = useResetAlertContext();

  function updateSidebarAndDisease(
    sideBarState: boolean,
    disease?: ApiDisease,
  ) {
    setSidebarOpen(sideBarState);
    setCurrentDisease(disease);
    resetAlertContext();
  }

  interface DiseaseFormData {
    diseaseName: string;
    estimatedFee: string; // no other way to get the optional number field cleared :(
    visibleToCitizenPortal: boolean;
  }

  const formikRef = useRef<SidebarFormHandle>(null);
  const { openConfirmationDialog } = useConfirmationDialog();

  function initialValues(): DiseaseFormData {
    return {
      diseaseName: currentDisease?.name ?? "",
      estimatedFee: currentDisease?.estimatedFee?.toString() ?? "",
      visibleToCitizenPortal: currentDisease?.visibleToCitizenPortal ?? false,
    };
  }

  function sidebarTitle(): string {
    return currentDisease ? "Krankheit bearbeiten" : "Krankheit hinzufügen";
  }

  function closeAndCleanSidebarForm() {
    updateSidebarAndDisease(false);
  }

  function newEntry() {
    updateSidebarAndDisease(true);
  }

  function editEntry(disease: ApiDisease) {
    updateSidebarAndDisease(true, disease);
  }

  async function deleteEntry(entryId: string) {
    await deleteDisease.mutateAsync(entryId);
  }

  function deleteDiseaseWithConfirmation(entryId: string, diseaseName: string) {
    openConfirmationDialog({
      title: `${diseaseName} löschen?`,
      description: `Möchten Sie ${diseaseName} wirklich löschen?`,
      confirmLabel: "Löschen",
      cancelLabel: "Abbrechen",
      onConfirm: () => deleteEntry(entryId),
      color: "danger",
    });
  }

  async function doSubmit(values: DiseaseFormData) {
    const request: ApiPostPutDiseaseRequest = {
      diseaseName: values.diseaseName,
      estimatedFee: +values.estimatedFee || undefined,
      visibleToCitizenPortal: values.visibleToCitizenPortal,
    };
    if (currentDisease) {
      const requestToSend: PutDiseaseRequest = {
        id: currentDisease.id,
        request: request,
      };
      await putDisease.mutateAsync(requestToSend, {
        onSuccess: () => {
          closeAndCleanSidebarForm();
          formikRef.current?.resetForm();
        },
      });
    } else {
      await postDisease.mutateAsync(request, {
        onSuccess: () => {
          closeAndCleanSidebarForm();
          formikRef.current?.resetForm();
        },
      });
    }
  }

  function getSubmitButtonLabel() {
    return currentDisease ? "Speichern" : "Hinzufügen";
  }

  function handleCancel() {
    closeAndCleanSidebarForm();
  }

  return (
    <>
      <TablePage
        controls={
          <ButtonBar
            // left={<FilterButton disabled />}
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
            columns={diseasesColumns(deleteDiseaseWithConfirmation, editEntry)}
          />
        </TableSheet>
      </TablePage>

      <Sidebar open={sidebarOpen} onClose={closeAndCleanSidebarForm}>
        <Formik
          initialValues={initialValues()}
          enableReinitialize={true}
          onSubmit={doSubmit}
        >
          {({ isSubmitting, resetForm }) => (
            <SidebarForm ref={formikRef}>
              <SidebarContent title={sidebarTitle()}>
                <Stack gap={2} rowGap={2}>
                  <InputField
                    name="diseaseName"
                    label="Name"
                    required="Bitte einen Namen angeben"
                    validate={validateLength(0, 200)}
                  />
                  <NumberField
                    name="estimatedFee"
                    label="Preisangabe in € für das Bürgerportal"
                    min={0.0}
                    validate={
                      validateNonNegativeNumberWithAtMostTwoDecimalDigits
                    }
                  />
                  <CheckboxField
                    name="visibleToCitizenPortal"
                    label="Sichtbarkeit im Bürgerportal"
                    sx={{
                      pt: "8px",
                      fontSize: "14px",
                    }}
                  />
                </Stack>
              </SidebarContent>

              <SidebarActions>
                <MultiFormButtonBar
                  submitLabel={getSubmitButtonLabel()}
                  submitting={isSubmitting}
                  onCancel={() => {
                    handleCancel();
                    resetForm();
                  }}
                />
              </SidebarActions>
            </SidebarForm>
          )}
        </Formik>
      </Sidebar>
    </>
  );
}
