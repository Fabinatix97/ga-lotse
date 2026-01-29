/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useGetSelfUser,
  useGetUsersByGroupQuery,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  OptionalFieldValue,
  SelectField,
  buildEnumOptions,
  mapOptionalValue,
  mapRequiredValue,
  parseOptionalValue,
  toDateTimeString,
} from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiConsultationType,
  ApiProcedureDetails,
  ApiUpdateProstituteProtectionProcedureRequest,
} from "@eshg/prostitute-protection-api";

import { useUpdateProcedureMutation } from "../../../../api/mutations/procedures";
import { useGetFreeAppointments } from "../../../../api/queries/procedures";
import {
  ADDITIONAL_DATA_FIELD_NAME,
  CONSULTATION_TYPE_VALUES,
  PROSTITUTE_PROTECTION_GROUP_NAME,
} from "../../../../shared/constants";
import {
  getAppointmentDate,
  getDuration,
  getDurationMinutes,
} from "../../../../shared/helpers";
import {
  AppointmentFields,
  AppointmentFieldsData,
} from "../../../form/AppointmentFields";
import { ConsultantSelectField } from "../../../form/ConsultantSelectField";

import "./EditAdditionalDataSidebar";
import { SidebarFormProvider } from "./SidebarFormProvider";

export interface EditProcedureDetailsDataForm extends AppointmentFieldsData {
  customAppointmentDate: string;
  appointmentBookingType: ApiAppointmentBookingType;
  consultationType: OptionalFieldValue<ApiConsultationType>;
  consultantId: OptionalFieldValue<string>;
  version: number;
}

interface EditAdditionalDataSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiProcedureDetails;
}

function EditAdditionalDataSidebar({
  formRef,
  onClose,
  procedure,
}: EditAdditionalDataSidebarProps) {
  const updateProcedure = useUpdateProcedureMutation(procedure.id);

  const { data: selfUser } = useGetSelfUser();

  const [{ data: allAssignableUsers }, { data: freeAppointments }] =
    useSuspenseQueries({
      queries: [
        useGetUsersByGroupQuery(PROSTITUTE_PROTECTION_GROUP_NAME),
        useGetFreeAppointments(procedure.id),
      ],
    });

  async function handleSubmit(values: EditProcedureDetailsDataForm) {
    const procedureData = mapFormToApi(values);
    await updateProcedure.mutateAsync(procedureData, {
      onSuccess: () => {
        onClose(true);
      },
    });
  }

  const initialValues = mapApiToForm(procedure);

  return (
    <SidebarFormProvider
      formRef={formRef}
      initialValues={initialValues}
      title="Zusatzinfos"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Stack gap={2}>
        <SelectField
          autoFocus
          name="consultationType"
          label={ADDITIONAL_DATA_FIELD_NAME.consultationType}
          required="Bitte einen Beratungstyp auswählen."
          options={buildEnumOptions(CONSULTATION_TYPE_VALUES)}
        />
        <ConsultantSelectField
          name="consultantId"
          selfUser={selfUser}
          options={allAssignableUsers}
        />
        <AppointmentFields freeAppointments={freeAppointments} />
      </Stack>
    </SidebarFormProvider>
  );
}

function getAppointmentBookingType(procedure: ApiProcedureDetails) {
  return procedure.appointmentFromAppointmentBlock
    ? ApiAppointmentBookingType.AppointmentBlock
    : ApiAppointmentBookingType.UserDefined;
}

function mapApiToForm(
  procedure: ApiProcedureDetails,
): EditProcedureDetailsDataForm {
  const { start, end } = procedure.appointment ?? {};
  const appointmentBookingType = getAppointmentBookingType(procedure);

  return {
    appointmentBookingType,
    blockAppointment:
      appointmentBookingType === "APPOINTMENT_BLOCK" && start && end
        ? { start, end }
        : undefined,
    customAppointmentDate:
      appointmentBookingType === "USER_DEFINED" && start
        ? toDateTimeString(start)
        : "",
    duration: getDurationMinutes(start, end),
    consultationType: parseOptionalValue(procedure.consultationType),
    consultantId: parseOptionalValue(procedure.consultant?.userId),
    version: procedure.version,
  };
}

function mapFormToApi(
  values: EditProcedureDetailsDataForm,
): ApiUpdateProstituteProtectionProcedureRequest {
  if (!values.appointmentBookingType) {
    throw new Error("Appointment booking type must be defined");
  }

  const appointmentStart = getAppointmentDate(values);
  if (!appointmentStart) {
    throw new Error("Appointment start must be defined");
  }

  const durationInMinutes = getDuration(values);
  if (!durationInMinutes) {
    throw new Error("Duration must be defined");
  }

  return {
    appointmentBookingType: values.appointmentBookingType,
    appointmentStart,
    durationInMinutes,
    consultantId: mapOptionalValue(values.consultantId),
    consultationType: mapRequiredValue(values.consultationType),
    version: values.version,
  };
}

export function useEditAdditionalDataSidebar(
  procedure: ApiProcedureDetails,
): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: (props) => (
      <EditAdditionalDataSidebar procedure={procedure} {...props} />
    ),
  });
}
