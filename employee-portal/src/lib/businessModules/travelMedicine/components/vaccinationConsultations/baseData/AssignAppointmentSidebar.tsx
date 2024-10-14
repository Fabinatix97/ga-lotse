/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiPatchServiceAssignmentRequest,
  AssignStepToServiceRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { isDefined } from "remeda";

import { useAssignStepToService } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllAvailableAppointmentsUnsuspended } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { AppointmentSheet } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/AppointmentSheet";
import { VaccinationConsultationSidebarsProps } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/VaccinationConsultationDetails";
import { createAppointmentOptions } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface AssignAppointmentValues {
  procedureId: string;
  serviceId: string;
  procedureStepId?: string;
}

export const initialValuesAssignAppointmentSidebar: AssignAppointmentValues = {
  procedureId: "",
  procedureStepId: "",
  serviceId: "",
};

interface AssignAppointmentSidebarProps {
  onSuccess: () => void;
  onCancel: (
    currentValues: AssignAppointmentValues,
    initialValues: AssignAppointmentValues,
    dirty: boolean,
  ) => void;
  onClose: (item: VaccinationConsultationSidebarsProps) => void;
  open: boolean;
  initialValues: AssignAppointmentValues;
}
export function AssignAppointmentSidebar(
  props: Readonly<AssignAppointmentSidebarProps>,
) {
  const getAllAvailableAppointments = useGetAllAvailableAppointmentsUnsuspended(
    props.initialValues.procedureId,
    props.open,
  );

  const allAvailableAppointments = getAllAvailableAppointments.data ?? [];

  const assignStepToServiceApi = useAssignStepToService();

  function createAssignsStepToServiceRequest(
    values: AssignAppointmentValues,
  ): AssignStepToServiceRequest {
    const apiPatchServiceAssignmentRequest: ApiPatchServiceAssignmentRequest = {
      procedureStepId: values.procedureStepId!,
    };

    return {
      procedureId: values.procedureId,
      serviceId: values.serviceId,
      apiPatchServiceAssignmentRequest: apiPatchServiceAssignmentRequest,
    };
  }

  async function handleSubmit(values: AssignAppointmentValues) {
    await assignStepToServiceApi
      .mutateAsync(createAssignsStepToServiceRequest(values), {
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
      {({ isSubmitting, values, dirty }) => (
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
            <SidebarContent title={"Impftermin"}>
              <Stack flexDirection="column" gap={2}>
                <AppointmentSheet
                  name="procedureStepId"
                  label="Termin aus Vorgang"
                  options={createAppointmentOptions(allAvailableAppointments)}
                />
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitLabel={"Speichern"}
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
