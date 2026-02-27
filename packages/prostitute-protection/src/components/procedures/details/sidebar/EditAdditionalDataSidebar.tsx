/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik } from "formik";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
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
  mapRequiredValue,
  parseOptionalValue,
  toDateTimeString,
} from "@eshg/lib-portal";
import {
  ApiAppointmentBookingType,
  ApiProcedureDetails,
  ApiUpdateProstituteProtectionProcedureRequest,
} from "@eshg/prostitute-protection-api";

import { useUpdateProcedureMutation } from "../../../../api/mutations/procedures";
import {
  ADDITIONAL_DATA_FIELD_NAME,
  PROCEDURE_TYPE_VALUES,
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

export interface EditProcedureDetailsDataForm extends AppointmentFieldsData {
  customAppointmentDate: string;
  appointmentBookingType: ApiAppointmentBookingType;
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
  const [{ data: allAssignableUsers }] = useSuspenseQueries({
    queries: [useGetUsersByGroupQuery(PROSTITUTE_PROTECTION_GROUP_NAME)],
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
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, setFieldValue }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title="Zusatzinfos">
            <Stack gap={2}>
              <SelectField
                autoFocus
                name="procedureType"
                label={ADDITIONAL_DATA_FIELD_NAME.procedureType}
                required="Bitte einen Beratungstyp auswählen."
                options={buildEnumOptions(PROCEDURE_TYPE_VALUES)}
                onChange={() => {
                  void setFieldValue("appointmentBookingType", "");
                  void setFieldValue("blockAppointment", undefined);
                }}
              />
              <ConsultantSelectField
                name="consultantId"
                selfUser={selfUser}
                options={allAssignableUsers}
              />
              <AppointmentFields />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel="Speichern"
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
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
    procedureType: procedure.procedureType,
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
    consultantId:
      values.appointmentBookingType === "APPOINTMENT_BLOCK"
        ? undefined
        : mapRequiredValue(values.consultantId),
    procedureType: mapRequiredValue(values.procedureType),
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
