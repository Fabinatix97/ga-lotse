/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { addMinutes, format } from "date-fns";

import {
  CustomAppointmentQuickButtons,
  DateTimeField,
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import {
  NumberField,
  OptionalFieldValue,
  useSnackbar,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";
import { ApiProcedureDetails } from "@eshg/prostitute-protection-api";

import {
  getDurationMinutes,
  validateDateTimeIsTodayOrFuture,
} from "../../../../shared/helpers";

import "./EditAppointmentDetailsSidebar";
import { SidebarFormProvider } from "./SidebarFormProvider";

export interface EditProcedureDetailsDataForm {
  customAppointmentDate: OptionalFieldValue<string>;
  appointmentDuration: number;
}

interface EditAppointmentDetailsSidebarProps extends SidebarWithFormRefProps {
  procedure: ApiProcedureDetails;
}

function EditAppointmentDetailsSidebar({
  formRef,
  onClose,
  procedure,
}: EditAppointmentDetailsSidebarProps) {
  const snackbar = useSnackbar();

  function handleSubmit(values: EditProcedureDetailsDataForm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        snackbar.confirmation("Angaben zum Termin erfolgreich aktualisiert");
        const apiValues = mapFormToApi(values);
        // eslint-disable-next-line no-console
        console.log({ appointment: apiValues });
        onClose();
        resolve(true);
      }, 1000);
    });
  }

  const initialValues = mapApiToForm(procedure);

  return (
    <SidebarFormProvider
      formRef={formRef}
      initialValues={initialValues}
      title="Angaben zum Termin bearbeiten"
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Stack gap={2}>
        <DateTimeField
          name="customAppointmentDate"
          label="Datum und Zeit"
          required="Datum und Zeit sind erforderlich"
          validate={validateDateTimeIsTodayOrFuture}
        />
        <CustomAppointmentQuickButtons />
        <NumberField
          name="appointmentDuration"
          label="Termindauer in Minuten"
          validate={validateIntegerAnd(validateRange(0, 1440))}
        />
      </Stack>
    </SidebarFormProvider>
  );
}

function mapApiToForm(
  procedure: ApiProcedureDetails,
): EditProcedureDetailsDataForm {
  const { start, end } = procedure.appointment ?? {};
  return {
    customAppointmentDate: start ? format(start, "yyyy-MM-dd'T'HH:mm") : "",
    appointmentDuration: getDurationMinutes(start, end),
  };
}

function mapFormToApi(values: EditProcedureDetailsDataForm) {
  return {
    start: new Date(values.customAppointmentDate),
    end: addMinutes(
      new Date(values.customAppointmentDate),
      values.appointmentDuration,
    ),
  };
}

export function useEditAppointmentDetailsSidebar(
  procedure: ApiProcedureDetails,
): UseSidebarWithFormRefResult {
  return useSidebarWithFormRef({
    component: (props) => (
      <EditAppointmentDetailsSidebar procedure={procedure} {...props} />
    ),
  });
}
