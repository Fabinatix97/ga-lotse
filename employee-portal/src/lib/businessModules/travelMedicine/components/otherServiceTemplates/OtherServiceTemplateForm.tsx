/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiOtherServiceTemplate,
  ApiPostPutOtherServiceTemplateRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { useSuspenseQueries } from "@tanstack/react-query";
import { useState } from "react";

import {
  useAddOtherServiceTemplate,
  useDeleteOtherServiceTemplate,
  useUpdateOtherServiceTemplate,
} from "@/lib/businessModules/travelMedicine/api/mutations/otherServiceTemplates";
import { useGetAllOtherServiceTemplatesQuery } from "@/lib/businessModules/travelMedicine/api/queries/otherServiceTemplates";
import { OtherServiceTable } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/OtherServiceTable";
import { OtherServiceTemplateSidebarStepForm } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/OtherServiceTemplateSidebarStepForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";

export interface OtherServiceTemplateFormValues {
  description: string;
  fee: number;
  id: string;
}

const INITIAL_VALUES: OtherServiceTemplateFormValues = {
  description: "",
  fee: 0,
  id: "",
};

export function OtherServiceTemplateForm() {
  const [{ data: allOtherServiceTemplates }] = useSuspenseQueries({
    queries: [useGetAllOtherServiceTemplatesQuery()],
  });
  const snackbar = useSnackbar();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [otherServiceFormValues, setOtherServiceFormValues] =
    useState<OtherServiceTemplateFormValues>(INITIAL_VALUES);

  const alertContext = useAlertContext();

  const createOtherServiceTemplateMutation = useAddOtherServiceTemplate();
  const updateOtherServiceTemplateMutation = useUpdateOtherServiceTemplate();
  const deleteOtherServiceTemplateMutation = useDeleteOtherServiceTemplate();

  function updateSidebar(sideBarState: boolean) {
    setSideBarOpen(sideBarState);
    resetAlertContext();
  }

  function resetAlertContext() {
    if (alertContext !== null) {
      alertContext.setAlert(null);
    }
  }

  async function createOtherServiceTemplate(
    request: ApiPostPutOtherServiceTemplateRequest,
  ) {
    await createOtherServiceTemplateMutation.mutateAsync(request, {
      onSuccess: () => {
        snackbar.confirmation("Leistung wurde angelegt");
      },
    });
  }

  async function updateOtherServiceTemplate(
    id: string,
    request: ApiPostPutOtherServiceTemplateRequest,
  ) {
    await updateOtherServiceTemplateMutation.mutateAsync(
      { id, request },
      {
        onSuccess: () => {
          snackbar.confirmation("Leistung wurde gespeichert");
        },
      },
    );
  }

  async function deleteOtherServiceTemplate(id: string) {
    await deleteOtherServiceTemplateMutation.mutateAsync(id, {
      onSuccess: () => {
        snackbar.confirmation("Leistung wurde gelöscht");
      },
    });
  }

  function cancelOtherServiceTemplateSideBar() {
    setOtherServiceFormValues(INITIAL_VALUES);
    updateSidebar(false);
  }

  async function handleOtherServiceTemplateSideBarSubmit(
    values: OtherServiceTemplateFormValues,
  ) {
    if (values.id) {
      await updateOtherServiceTemplate(values.id, {
        description: values.description,
        fee: values.fee,
      });
    } else {
      await createOtherServiceTemplate({
        description: values.description,
        fee: values.fee,
      });
    }
    setOtherServiceFormValues(INITIAL_VALUES);
    updateSidebar(false);
  }

  function handleAddOtherServiceTemplate() {
    if (!sideBarOpen) {
      updateSidebar(true);
    }
  }

  return (
    <>
      <OtherServiceTable
        data={allOtherServiceTemplates}
        handleAddEntry={handleAddOtherServiceTemplate}
        handleDeleteEntry={deleteOtherServiceTemplate}
        openCloseVaccinationStepSidebar={(
          selected: ApiOtherServiceTemplate,
        ) => {
          setOtherServiceFormValues(selected);
          updateSidebar(true);
        }}
      ></OtherServiceTable>

      <Sidebar open={sideBarOpen} onClose={cancelOtherServiceTemplateSideBar}>
        <OtherServiceTemplateSidebarStepForm
          initialValues={otherServiceFormValues}
          onSubmit={handleOtherServiceTemplateSideBarSubmit}
          onCancel={cancelOtherServiceTemplateSideBar}
        />
      </Sidebar>
    </>
  );
}
