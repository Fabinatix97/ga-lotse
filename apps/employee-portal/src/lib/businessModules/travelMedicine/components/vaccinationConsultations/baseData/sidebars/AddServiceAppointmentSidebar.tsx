/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";
import { format } from "date-fns";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { toUtcDate } from "@eshg/lib-portal";
import {
  AddProcedureStepRequest,
  ApiAppointmentBookingType,
  ApiAppointmentType,
} from "@eshg/travel-medicine-api";

import { useAppointmentStandardDurationsApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { useAddProcedureStep } from "@/lib/businessModules/travelMedicine/api/mutations/vaccinationConsultation";
import { useGetFreeAppointmentsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { useGetAppointmentStandardDurationsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentStandardDurations";
import { useGetAllAssignableServicesQuery } from "@/lib/businessModules/travelMedicine/api/queries/vaccinationConsultation";
import {
  AddServiceAppointmentForm,
  AddServiceAppointmentFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/AddServiceAppointmentForm";
import { determineStartAndDuration } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";

export function useAddServiceAppointmentSidebar(): UseSidebarWithFormRefResult<AddServiceAppointmentSidebarProps> {
  return useSidebarWithFormRef({
    component: AddServiceAppointmentSidebar,
  });
}

interface AddServiceAppointmentSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  isCitizenFollowUp: boolean;
}

function AddServiceAppointmentSidebar(
  props: Readonly<AddServiceAppointmentSidebarProps>,
) {
  const addProcedure = useAddProcedureStep();
  const standardDurationApi = useAppointmentStandardDurationsApi();

  const [
    { data: standardDurations },
    { data: allAssignableServices },
    { data: freeConsultationBlockAppointments },
    { data: freeVaccinationBlockAppointments },
  ] = useSuspenseQueries({
    queries: [
      useGetAppointmentStandardDurationsQuery(standardDurationApi),
      useGetAllAssignableServicesQuery(props.procedureId),
      useGetFreeAppointmentsQuery(ApiAppointmentType.Consultation),
      useGetFreeAppointmentsQuery(ApiAppointmentType.Vaccination),
    ],
  });

  function createUseAddProcedureRequest(
    values: AddServiceAppointmentFormValues,
  ) {
    const services: string[] = [];
    values.serviceChecks?.forEach((value) => {
      services.push(value.serviceId);
    });

    const { appointmentStart, durationInMinutes } = determineStartAndDuration(
      values.bookingType,
      values.userDefinedAppointmentDate!,
      values.blockAppointment,
      values.appointmentTypeStandardDuration,
    );

    const request: AddProcedureStepRequest = {
      id: values.procedureId,
      apiPostProcedureStepRequest: {
        services: services,
        appointmentBookingType: values.bookingType!,
        appointmentStart:
          values.bookingType !== ApiAppointmentBookingType.SelfBooking
            ? appointmentStart
            : undefined,
        durationInMinutes:
          values.bookingType !== ApiAppointmentBookingType.SelfBooking
            ? durationInMinutes
            : undefined,
        earliestDate:
          props.isCitizenFollowUp && values.earliestDate
            ? toUtcDate(values.earliestDate as string)
            : undefined,
      },
    };

    return { request };
  }

  async function handleSubmit(values: AddServiceAppointmentFormValues) {
    const useAddProcedureRequest = createUseAddProcedureRequest(values);
    await addProcedure.mutateAsync(useAddProcedureRequest.request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  const initialServiceAppointmentFormValues: AddServiceAppointmentFormValues = {
    procedureId: props.procedureId,
    serviceChecks: [],
    bookingType: "" as ApiAppointmentBookingType,
    blockAppointment: undefined,
    userDefinedAppointmentDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    appointmentTypeStandardDuration:
      standardDurations.standardDurations[ApiAppointmentType.Vaccination] ?? 0,
    appointmentType: "" as ApiAppointmentType,
    earliestDate: format(new Date(), "yyyy-MM-dd"),
  };

  return (
    <AddServiceAppointmentForm
      initialValues={initialServiceAppointmentFormValues}
      allAssignableServices={allAssignableServices ?? []}
      isCitizenFollowUp={props.isCitizenFollowUp}
      freeConsultationBlockAppointments={freeConsultationBlockAppointments}
      freeVaccinationBlockAppointments={freeVaccinationBlockAppointments}
      formRef={props.formRef}
      title="Impftermin"
      submitLabel="Erstellen"
      onCancel={props.onClose}
      onSubmit={handleSubmit}
    />
  );
}
