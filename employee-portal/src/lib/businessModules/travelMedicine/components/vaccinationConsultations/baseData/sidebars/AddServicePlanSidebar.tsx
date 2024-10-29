/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiPostServicesRequest,
  ApiVaccinationType,
  PostServicesRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { useSuspenseQueries } from "@tanstack/react-query";
import { isDefined } from "remeda";

import { usePostServices } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllDiseasesQuery } from "@/lib/businessModules/travelMedicine/api/queries/diseaseApi";
import { useGetAllOtherServiceTemplatesQuery } from "@/lib/businessModules/travelMedicine/api/queries/otherServiceTemplates";
import { useGetAllAvailableAppointmentsQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { useGetAllVaccinesQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccines";
import {
  AddServicePlanForm,
  AddServicePlanFormValues,
  ServicesRequest,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AddServicePlanForm";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useAddServicePlanSidebar(): UseSidebarWithFormRefResult<AddServicePlanSidebarProps> {
  return useSidebarWithFormRef({
    component: AddServicePlanSidebar,
  });
}

export const initServicesValues: ServicesRequest = {
  serviceType: "VACCINATION",
  description: "",
  vaccinationType: ApiVaccinationType.Basic,
  diseaseId: "",
  vaccineId: "",
  fee: 0,
  createSeries: false,
  vaccinationNumber: 1,
  templateId: "",
};

interface AddServicePlanSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
}

function AddServicePlanSidebar(props: Readonly<AddServicePlanSidebarProps>) {
  const postServicesApi = usePostServices();

  const [
    { data: allAvailableAppointments },
    { data: allOtherServiceTemplates },
    { data: allVaccines },
    { data: allDiseases },
  ] = useSuspenseQueries({
    queries: [
      useGetAllAvailableAppointmentsQuery(props.procedureId),
      useGetAllOtherServiceTemplatesQuery(),
      useGetAllVaccinesQuery(),
      useGetAllDiseasesQuery(),
    ],
  });

  function createPostServicesRequest(values: AddServicePlanFormValues) {
    values.services.forEach((service) => {
      service.diseaseId = service.diseaseId.split(",")[0]!;
    });
    const apiPostServicesRequest: ApiPostServicesRequest = {
      procedureStepId: values.procedureStepId,
      postVaccinationRequests: values.services.filter(
        (value) => value.serviceType === "VACCINATION",
      ),
      postOtherServiceRequests: values.services.filter(
        (value) =>
          value.serviceType === "OTHER" ||
          value.serviceType === "OTHER_TEMPLATES",
      ),
    };

    const request: PostServicesRequest = {
      apiPostServicesRequest,
      procedureId: values.procedureId,
    };
    return request;
  }

  async function handleSubmit(values: AddServicePlanFormValues) {
    await postServicesApi
      .mutateAsync(createPostServicesRequest(values), {
        onSuccess: () => {
          props.onClose(true);
        },
      })
      .catch();
  }

  const initServicesValues: ServicesRequest = {
    serviceType: "VACCINATION",
    description: "",
    vaccinationType: ApiVaccinationType.Basic,
    diseaseId: "",
    vaccineId: "",
    fee: 0,
    createSeries: false,
    vaccinationNumber: 1,
    templateId: "",
  };

  const initialServicePlanFormValues: AddServicePlanFormValues = {
    procedureId: props.procedureId,
    procedureStepId: isDefined(allAvailableAppointments.at(-1)?.procedureStepId)
      ? allAvailableAppointments.at(-1)?.procedureStepId
      : "",
    services: [initServicesValues],
  };

  return (
    <AddServicePlanForm
      initialValues={initialServicePlanFormValues}
      allAvailableAppointments={allAvailableAppointments ?? []}
      allOtherServiceTemplates={allOtherServiceTemplates ?? []}
      allVaccines={allVaccines ?? []}
      allDiseases={allDiseases ?? []}
      formRef={props.formRef}
      onCancel={props.onClose}
      onSubmit={handleSubmit}
      title={"Leistung"}
      submitLabel={"Hinzufügen"}
    />
  );
}
