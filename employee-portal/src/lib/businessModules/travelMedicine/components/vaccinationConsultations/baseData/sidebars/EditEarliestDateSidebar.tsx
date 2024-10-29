/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiServicePlanEntry,
  PatchEarliestDateRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSuspenseQueries } from "@tanstack/react-query";
import { format } from "date-fns";

import { usePatchEarliestDate } from "@/lib/businessModules/travelMedicine/api/mutations/procedureSteps";
import { useGetProcedureStepServicesQuery } from "@/lib/businessModules/travelMedicine/api/queries/procedureSteps";
import {
  EditEarliestDateForm,
  EditEarliestDateFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/EditEarliestDateForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useEditEarliestDateSidebar(): UseSidebarWithFormRefResult<EditEarliestDateSidebarProps> {
  return useSidebarWithFormRef({
    component: EditEarliestDateSidebar,
  });
}

interface EditEarliestDateSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  service: ApiServicePlanEntry;
}

function EditEarliestDateSidebar(
  props: Readonly<EditEarliestDateSidebarProps>,
) {
  const patchEarliestDate = usePatchEarliestDate();

  const [{ data: procedureStepServices }] = useSuspenseQueries({
    queries: [useGetProcedureStepServicesQuery(props.service.procedureStepId!)],
  });

  function createPatchEarliestDateRequest(values: EditEarliestDateFormValues) {
    const request: PatchEarliestDateRequest = {
      id: props.service.procedureStepId ?? "",
      apiPatchEarliestDateRequest: {
        earliestDate: new Date(values.earliestDate),
      },
    };
    return {
      request,
    };
  }

  async function handleSubmit(values: EditEarliestDateFormValues) {
    const patchAppointmentRequest = createPatchEarliestDateRequest(values);

    await patchEarliestDate
      .mutateAsync(patchAppointmentRequest.request, {
        onSuccess: () => {
          props.onClose(true);
        },
      })
      .catch();
  }

  function mapProcedureStepToEditEarliestDateValues(
    procedureStep: ApiServicePlanEntry,
  ) {
    return {
      earliestDate: procedureStep.earliestDate
        ? format(new Date(procedureStep.earliestDate), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    };
  }

  return (
    <EditEarliestDateForm
      initialValues={mapProcedureStepToEditEarliestDateValues(props.service)}
      procedureStepServices={procedureStepServices ?? []}
      formRef={props.formRef}
      onCancel={props.onClose}
      onSubmit={handleSubmit}
      title={"Buchbar ab bearbeiten"}
      submitLabel={"Speichern"}
    />
  );
}
