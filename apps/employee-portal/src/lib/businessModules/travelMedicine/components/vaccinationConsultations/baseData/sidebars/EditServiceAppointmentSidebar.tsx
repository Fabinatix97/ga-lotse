/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQueries } from "@tanstack/react-query";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  ApiAppointmentType,
  ApiServicePlanGroup,
  PatchAppointmentRequest,
} from "@eshg/travel-medicine-api";

import { usePatchAppointment } from "@/lib/businessModules/travelMedicine/api/mutations/procedureSteps";
import { useGetFreeAppointmentsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { useGetAllAppointmentTypesQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentTypes";
import { useGetProcedureStepServicesQuery } from "@/lib/businessModules/travelMedicine/api/queries/procedureSteps";
import {
  EditServiceAppointmentForm,
  EditServiceAppointmentFormValues,
} from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/baseData/sidebars/sidebarForms/EditServiceAppointmentForm";
import { determineStartAndDuration } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { mapDateTimeToInput } from "@/lib/shared/components/formFields/dateOrDateTimeFieldHelper";

export function useEditServiceAppointmentSidebar(): UseSidebarWithFormRefResult<EditServiceAppointmentSidebarProps> {
  return useSidebarWithFormRef({
    component: EditServiceAppointmentSidebar,
  });
}

interface EditServiceAppointmentSidebarProps extends SidebarWithFormRefProps {
  procedureId: string;
  procedureStep: ApiServicePlanGroup;
  isInitialStep: (procedureStepId: string) => boolean;
}

function EditServiceAppointmentSidebar(
  props: Readonly<EditServiceAppointmentSidebarProps>,
) {
  const patchProcedure = usePatchAppointment();

  const [
    { data: allAppointmentTypes },
    { data: procedureStepServices },
    { data: freeConsultationBlockAppointments },
    { data: freeVaccinationBlockAppointments },
  ] = useSuspenseQueries({
    queries: [
      useGetAllAppointmentTypesQuery(),
      useGetProcedureStepServicesQuery(
        props.procedureStep.procedureStepId ?? "",
      ),
      useGetFreeAppointmentsQuery(ApiAppointmentType.Consultation),
      useGetFreeAppointmentsQuery(ApiAppointmentType.Vaccination),
    ],
  });

  const vaccinationStandardDuration = allAppointmentTypes
    ? allAppointmentTypes.appointmentTypeConfigs.find(
        (type) => type.appointmentTypeDto === ApiAppointmentType.Vaccination,
      )!.standardDurationInMinutes
    : "";

  function createUsePatchAppointmentRequest(
    values: EditServiceAppointmentFormValues,
  ) {
    const { appointmentStart, durationInMinutes } = determineStartAndDuration(
      values.bookingType,
      values.userDefinedAppointmentDate!,
      values.appointmentBlockDate,
      values.appointmentTypeStandardDuration,
    );
    const request: PatchAppointmentRequest = {
      id: values.procedureStepId,
      apiPatchAppointmentRequest: {
        appointmentType: values.appointmentType!,
        appointmentBookingType: values.bookingType!,
        appointmentStart: appointmentStart,
        durationInMinutes: durationInMinutes,
      },
    };
    return {
      request,
    };
  }

  async function handleSubmit(values: EditServiceAppointmentFormValues) {
    const usePatchAppointment = createUsePatchAppointmentRequest(values);

    await patchProcedure.mutateAsync(usePatchAppointment.request, {
      onSuccess: () => {
        props.onClose(true);
      },
    });
  }

  function mapProcedureStepToEditAppointmentValues(
    procedureStep: ApiServicePlanGroup,
  ) {
    return {
      procedureId: props.procedureId,
      procedureStepId: procedureStep.procedureStepId ?? "",
      bookingType: procedureStep.appointmentBookingType,
      appointmentBlockDate: undefined,
      appointmentType: procedureStep.appointmentType,
      userDefinedAppointmentDate: mapDateTimeToInput(new Date(), false),
      appointmentTypeStandardDuration: vaccinationStandardDuration as number,
      appointmentDate: procedureStep.appointment,
      earliestDate: procedureStep.earliestDate,
    };
  }

  return (
    <EditServiceAppointmentForm
      initialValues={mapProcedureStepToEditAppointmentValues(
        props.procedureStep,
      )}
      isInitialStep={
        props.procedureStep.procedureStepId
          ? props.isInitialStep(props.procedureStep.procedureStepId)
          : false
      }
      procedureStepServices={procedureStepServices}
      freeConsultationBlockAppointments={freeConsultationBlockAppointments}
      freeVaccinationBlockAppointments={freeVaccinationBlockAppointments}
      formRef={props.formRef}
      title="Impftermin bearbeiten"
      submitLabel="Speichern"
      onCancel={props.onClose}
      onSubmit={handleSubmit}
    />
  );
}
