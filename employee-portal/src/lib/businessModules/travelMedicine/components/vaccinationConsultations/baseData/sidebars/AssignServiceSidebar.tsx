/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { isDefined } from "remeda";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  ApiPatchServiceAssignmentRequest,
  AssignStepToServiceRequest,
} from "@eshg/travel-medicine-api";

import { useAssignStepToService } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllAvailableAppointmentsQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import {
  AssignServiceForm,
  AssignServiceFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AsssignServiceForm";

export function useAssignServiceSidebar(): UseSidebarWithFormRefResult<AssignServiceSidebarProps> {
  return useSidebarWithFormRef({
    component: AssignServiceSidebar,
  });
}

interface AssignServiceSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  serviceId: string;
}

function AssignServiceSidebar(props: Readonly<AssignServiceSidebarProps>) {
  const assignStepToServiceApi = useAssignStepToService();

  const [{ data: allAvailableAppointments }] = useSuspenseQueries({
    queries: [useGetAllAvailableAppointmentsQuery(props.procedureId)],
  });

  function createAssignsStepToServiceRequest(
    values: AssignServiceFormValues,
  ): AssignStepToServiceRequest {
    const apiPatchServiceAssignmentRequest: ApiPatchServiceAssignmentRequest = {
      procedureStepId: values.procedureStepId!,
    };

    return {
      procedureId: props.procedureId,
      serviceId: props.serviceId,
      apiPatchServiceAssignmentRequest: apiPatchServiceAssignmentRequest,
    };
  }

  async function handleSubmit(values: AssignServiceFormValues) {
    await assignStepToServiceApi.mutateAsync(
      createAssignsStepToServiceRequest(values),
      {
        onSuccess: () => {
          props.onClose(true);
        },
      },
    );
  }

  return (
    <AssignServiceForm
      initialValues={{
        procedureStepId: isDefined(
          allAvailableAppointments.at(-1)?.procedureStepId,
        )
          ? allAvailableAppointments.at(-1)?.procedureStepId
          : "",
      }}
      allAvailableAppointments={allAvailableAppointments}
      formRef={props.formRef}
      title="Impftermin"
      submitLabel="Speichern"
      onCancel={props.onClose}
      onSubmit={handleSubmit}
    />
  );
}
