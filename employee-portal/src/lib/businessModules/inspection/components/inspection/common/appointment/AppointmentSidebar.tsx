/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInspectionAppointment } from "@eshg/inspection-api";
import { DateField } from "@eshg/lib-portal/components/formFields/DateField";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";
import { Grid } from "@mui/joy";
import { addHours, endOfDay, getDay } from "date-fns";
import { Formik, FormikErrors } from "formik";
import { SetStateAction, useMemo, useRef } from "react";
import { isDefined, isEmpty, isNonNullish } from "remeda";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { TimeField } from "@/lib/shared/components/formFields/TimeField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  formatTimeInput,
  isBeforeTime,
  parseTime,
  toLocalDateTime,
} from "@/lib/shared/helpers/dateTime";

export interface AppointmentSidebarProps {
  open: boolean;
  onClose: () => void;
  procedureId: string;
  appointment?: ApiInspectionAppointment;
  hoursToAddToEndTime?: number;
  forExecution?: boolean;
}

interface AppointmentFormType {
  date: string;
  startTime: string;
  endTime: string;
}

export function AppointmentSidebar(props: AppointmentSidebarProps) {
  return (
    <OverlayBoundary>
      <AppointmentSidebarWithMutations {...props} />
    </OverlayBoundary>
  );
}

function AppointmentSidebarWithMutations({
  open,
  onClose,
  procedureId,
  appointment,
  hoursToAddToEndTime,
  forExecution,
}: Readonly<AppointmentSidebarProps>) {
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  const { mutateAsync: updateInspection } = useUpdateInspection();

  function handleClose() {
    sidebarFormRef.current?.resetForm();
    onClose();
  }

  async function handleSubmit(formValues: AppointmentFormType) {
    const appointment = {
      start: toLocalDateTime(formValues.date, formValues.startTime),
      end: toLocalDateTime(formValues.date, formValues.endTime),
    };
    await updateInspection(
      {
        id: procedureId,
        apiUpdateInspectionRequest: forExecution
          ? { executedAppointment: appointment }
          : { plannedAppointment: appointment },
      },
      {
        onSuccess: handleClose,
      },
    );
  }

  const initialValues: AppointmentFormType = useMemo(() => {
    return {
      date: appointment?.start ? toDateString(appointment.start) : "",
      startTime: appointment?.start ? formatTimeInput(appointment.start) : "",
      endTime: appointment?.end ? formatTimeInput(appointment.end) : "",
    };
  }, [appointment?.end, appointment?.start]);

  const title = isDefined(appointment)
    ? "Termin bearbeiten"
    : "Termin hinzufügen";

  return (
    <Sidebar open={open} onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, handleSubmit, values, setValues }) => (
          <SidebarForm onSubmit={handleSubmit} ref={sidebarFormRef}>
            <SidebarContent title={title}>
              <Grid container columnSpacing={2} rowSpacing={3}>
                <Grid xs={12}>
                  <DateField
                    name="date"
                    label="Datum"
                    required="Bitte ein Datum angeben."
                  />
                </Grid>
                <Grid xs={6}>
                  <TimeField
                    name="startTime"
                    label="Startzeit"
                    required="Bitte eine Startzeit angeben."
                  />
                </Grid>
                <Grid xs={6}>
                  <TimeField
                    name="endTime"
                    label="Endzeit"
                    required="Bitte eine Endzeit angeben."
                    validate={(value) =>
                      validateAppointmentEndTime(value, values)
                    }
                    onFocus={() =>
                      handleAddingHoursToEndTime(
                        values,
                        setValues,
                        hoursToAddToEndTime,
                      )
                    }
                  />
                </Grid>
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitting={isSubmitting}
                onCancel={handleClose}
                submitLabel="Speichern"
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

export function validateAppointmentEndTime(
  value: string,
  appointment: AppointmentFormType | undefined,
) {
  if (appointment?.startTime && isBeforeTime(value, appointment.startTime)) {
    return "Endzeit muss nach der Startzeit liegen.";
  }
  return undefined;
}

async function handleAddingHoursToEndTime(
  values: AppointmentFormType,
  setValues: (
    values: SetStateAction<AppointmentFormType>,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<AppointmentFormType>>,
  hoursToAddToEndTime?: number,
) {
  if (
    isEmpty(values.endTime) &&
    isNonNullish(hoursToAddToEndTime) &&
    hoursToAddToEndTime > 0
  ) {
    const startDate = parseTime(values.startTime);
    let endDate = addHours(startDate, hoursToAddToEndTime);
    if (getDay(endDate) !== getDay(startDate)) {
      endDate = endOfDay(startDate);
    }
    await setValues({
      ...values,
      startTime: formatTimeInput(startDate),
      endTime: formatTimeInput(endDate),
    });
  }
}
