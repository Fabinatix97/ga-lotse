/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiPostOtherServiceRequest,
  ApiPostServicesRequest,
  ApiPostVaccinationRequest,
  ApiVaccinationType,
} from "@eshg/employee-portal-api/travelMedicine";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import {
  UsePostServicesRequest,
  usePostServices,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllAvailableAppointmentsUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { AppointmentSheet } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AppointmentSheet";
import { ServicesSheet } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/ServicesSheet";
import { VaccinationConsultationSidebarsProps } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { createAppointmentOptions } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export type ServicesRequest = ApiPostOtherServiceRequest &
  ApiPostVaccinationRequest & { serviceType: string; templateId: string };

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

export const initialValuesServicePlanSidebar: ServiceValues = {
  procedureId: "",
  procedureStepId: "",
  services: [initServicesValues],
};

export interface ServiceValues {
  procedureId: string;
  procedureStepId?: string;
  services: ServicesRequest[];
}

interface ServicePlanSidebarProps {
  onSuccess: () => void;
  onCancel: (
    currentValues: ServiceValues,
    initialValues: ServiceValues,
    dirty: boolean,
  ) => void;
  onClose: (item: VaccinationConsultationSidebarsProps) => void;
  open: boolean;
  initialValues: ServiceValues;
}

export function ServicePlanSidebar(props: Readonly<ServicePlanSidebarProps>) {
  const postServicesApi = usePostServices();

  const getAllAvailableAppointments = useGetAllAvailableAppointmentsUnsuspended(
    props.initialValues.procedureId,
    props.open,
  );
  const allAvailableAppointments = getAllAvailableAppointments.data ?? [];

  function createPostServicesRequest(values: ServiceValues) {
    values.services.forEach((service) => {
      service.diseaseId = service.diseaseId.split(",")[0]!;
    });
    const apiRequest: ApiPostServicesRequest = {
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

    const request: UsePostServicesRequest = {
      apiRequest,
      procedureId: values.procedureId,
    };
    return request;
  }

  async function handleSubmit(values: ServiceValues) {
    await postServicesApi
      .mutateAsync(createPostServicesRequest(values), {
        onSuccess: props.onSuccess,
      })
      .catch();
  }

  return (
    <Formik
      initialValues={{
        ...props.initialValues,
        procedureStepId: props.initialValues.procedureStepId
          ? props.initialValues.procedureStepId
          : isDefined(allAvailableAppointments.at(-1)?.procedureStepId)
            ? allAvailableAppointments.at(-1)?.procedureStepId
            : "",
      }}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, dirty, isSubmitting }) => (
        <Sidebar
          onClose={() => {
            props.onClose({
              open: false,
              initialValues: { ...values },
            });
          }}
          open={props.open}
        >
          <SidebarForm style={{ display: "contents" }}>
            <SidebarContent title={"Leistung"}>
              <Stack flexDirection="column" gap={2} data-testid="appointment">
                <AppointmentSheet
                  name="procedureStepId"
                  label="Termin aus Vorgang"
                  options={[
                    { label: "", value: "" },
                    ...createAppointmentOptions(allAvailableAppointments),
                  ]}
                />
                <ServicesSheet open={props.open} />
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitLabel="Speichern"
                submitting={isSubmitting}
                onCancel={() => {
                  props.onCancel(values, props.initialValues, dirty);
                }}
              />
            </SidebarActions>
          </SidebarForm>
        </Sidebar>
      )}
    </Formik>
  );
}
