/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
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
  ApiConsultationType,
  ApiProcedureDetails,
  ApiUpdateProstituteProtectionProcedureRequest,
} from "@eshg/prostitute-protection-api";

import { useUpdateProcedureMutation } from "../../../../api/mutations/procedures";
import {
  ADDITIONAL_DATA_FIELD_NAME,
  CONSULTATION_TYPE_VALUES,
} from "../../../../shared/constants";
import { getDurationMinutes } from "../../../../shared/helpers";
import {
  AppointmentFields,
  AppointmentFieldsData,
} from "../../../form/AppointmentFields";

import "./EditAdditionalDataSidebar";
import { SidebarFormProvider } from "./SidebarFormProvider";

interface EditProcedureDetailsDataForm extends AppointmentFieldsData {
  customAppointmentDate: string;
  appointmentBookingType: ApiAppointmentBookingType;
  consultationType: OptionalFieldValue<ApiConsultationType>;
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
  const updateProcedure = useUpdateProcedureMutation();

  async function handleSubmit(values: EditProcedureDetailsDataForm) {
    const procedureData = mapFormToApi(values);
    await updateProcedure.mutateAsync(
      {
        procedureId: procedure.id,
        apiUpdateProstituteProtectionProcedureRequest: procedureData,
      },
      {
        onSuccess: () => {
          onClose(true);
        },
      },
    );
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
          name="consultationType"
          label={ADDITIONAL_DATA_FIELD_NAME.consultationType}
          required="Bitte einen Beratungstyp auswählen."
          options={buildEnumOptions(CONSULTATION_TYPE_VALUES)}
        />

        <AppointmentFields />
      </Stack>
    </SidebarFormProvider>
  );
}

function mapApiToForm(
  procedure: ApiProcedureDetails,
): EditProcedureDetailsDataForm {
  const { start, end } = procedure.appointment ?? {};
  return {
    appointmentBookingType: ApiAppointmentBookingType.UserDefined,
    customAppointmentDate: start ? toDateTimeString(start) : "",
    duration: getDurationMinutes(start, end),
    consultationType: parseOptionalValue(procedure.consultationType),
    version: procedure.version,
  };
}

function mapFormToApi(
  values: EditProcedureDetailsDataForm,
): ApiUpdateProstituteProtectionProcedureRequest {
  return {
    appointmentBookingType: values.appointmentBookingType,
    appointmentStart: new Date(values.customAppointmentDate),
    durationInMinutes: values.duration,
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
