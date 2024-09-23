/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetAvailableAppointmentsResponse,
  ApiPatchServiceAssingnmentRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import { Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  UseAssignStepToServiceRequest,
  useAssignStepToService,
} from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetAllAvailableAppointments } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface InitAssignAppointmentForm {
  procedureId: string;
  serviceId: string;
  procedureStepId?: string;
}

interface AssignAppointmentSidebarProps {
  open: boolean;
  onClose: () => void;
  initialValues: InitAssignAppointmentForm;
}
export function AssignAppointmentSidebar(
  props: Readonly<AssignAppointmentSidebarProps>,
) {
  const assignStepToServiceApi = useAssignStepToService();
  const allAvailableAppointments = useGetAllAvailableAppointments(
    props.initialValues.procedureId,
  );

  function createAssignsStepToServiceRequest(
    values: InitAssignAppointmentForm,
  ) {
    const apiRequest: ApiPatchServiceAssingnmentRequest = {
      procedureStepId: values.procedureStepId!,
    };

    const request: UseAssignStepToServiceRequest = {
      apiRequest,
      procedureId: values.procedureId,
      serviceId: values.serviceId,
    };
    return request;
  }

  function handleSubmit(
    values: InitAssignAppointmentForm,
    resetForm: () => void,
  ) {
    const request = createAssignsStepToServiceRequest(values);
    return assignStepToServiceApi.mutate(request, {
      onSuccess: () => {
        props.onClose();
        resetForm();
      },
    });
  }

  function createAppointmentOptions(
    availableAppointments: ApiGetAvailableAppointmentsResponse | undefined,
  ) {
    if (availableAppointments) {
      const labelOptions: SelectOption[] =
        availableAppointments.appointmentSummaryList.map((appointment) => ({
          label: formatDateTime(appointment.start) + " Uhr",
          value: appointment.procedureStepId,
        }));

      return labelOptions;
    } else {
      return [];
    }
  }

  return (
    <Sidebar open={props.open} onClose={props.onClose}>
      <Formik
        initialValues={{
          ...props.initialValues,
          availableAppointments: allAvailableAppointments.data,
          procedureStepId:
            allAvailableAppointments.data?.appointmentSummaryList?.at(-1)
              ?.procedureStepId,
        }}
        onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        enableReinitialize
      >
        {({ isSubmitting, values, resetForm }) => (
          <FormPlus style={{ display: "contents" }}>
            <SidebarContent title={"Impftermin"}>
              <Typography level="body-md" sx={{ fontWeight: "bold" }}>
                Termin
              </Typography>
              <SelectField
                label="Termin aus Vorgang"
                name="procedureStepId"
                options={createAppointmentOptions(values.availableAppointments)}
                required={"Bitte einen Termin auswählen"}
              />
            </SidebarContent>
            <SidebarActions>
              <MultiFormButtonBar
                submitLabel={"Speichern"}
                submitting={isSubmitting}
                onCancel={() => {
                  props.onClose();
                  resetForm();
                }}
              />
            </SidebarActions>
          </FormPlus>
        )}
      </Formik>
    </Sidebar>
  );
}
