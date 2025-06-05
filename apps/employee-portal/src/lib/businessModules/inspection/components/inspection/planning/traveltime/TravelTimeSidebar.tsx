/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Typography } from "@mui/joy";
import { addMinutes, isAfter, isBefore, subMinutes } from "date-fns";
import { Formik, FormikErrors } from "formik";
import { SetStateAction, useMemo, useRef } from "react";
import { isEmpty } from "remeda";

import type {
  ApiInspectionAppointment,
  ApiInspectionTravelTime,
  ApiObjectType,
} from "@eshg/inspection-api";
import {
  DateTimeField,
  FormButtonBar,
  OverlayBoundary,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  validateNonNegativeInteger,
} from "@eshg/lib-employee-portal";
import { NumberField, isEmptyString, toDateTimeString } from "@eshg/lib-portal";

import { useUpdateInspection } from "@/lib/businessModules/inspection/api/mutations/inspection";
import { Appointment } from "@/lib/businessModules/schoolEntry/api/models/Appointment";
import { durationBetweenDatesInMinutes } from "@/lib/shared/helpers/dateTime";

interface TravelTimeSidebarProps {
  open: boolean;
  onClose: () => void;
  procedureId: string;
  objectType?: ApiObjectType;
  appointment?: ApiInspectionAppointment;
  travelTime?: ApiInspectionTravelTime;
}

interface TravelTimeFormType {
  startBuffer: number | string;
  startTime: string;
  endBuffer: number | string;
  endTime: string;
}

export function TravelTimeSidebar(props: TravelTimeSidebarProps) {
  return (
    <OverlayBoundary>
      <TravelTimeSidebarWithMutations {...props} />
    </OverlayBoundary>
  );
}

function getStartBuffer(
  travelTime: ApiInspectionTravelTime | undefined,
  objectType: ApiObjectType | undefined,
) {
  return (
    travelTime?.startBufferInMinutes ?? objectType?.standardBufferTime ?? ""
  );
}

function calculateStartTime(
  appointment: ApiInspectionAppointment | undefined,
  startTimeBuffer: number | string,
) {
  if (appointment?.start) {
    const startTime = subMinutes(
      appointment.start,
      typeof startTimeBuffer === "number" ? startTimeBuffer : 0,
    );
    return toDateTimeString(startTime);
  } else {
    return "";
  }
}

function getEndBuffer(
  travelTime: ApiInspectionTravelTime | undefined,
  objectType: ApiObjectType | undefined,
) {
  return travelTime?.endBufferInMinutes ?? objectType?.standardBufferTime ?? "";
}

function calculateEndTime(
  appointment: ApiInspectionAppointment | undefined,
  endTimeBuffer: number | string,
) {
  if (appointment?.end) {
    const endTime = addMinutes(
      appointment.end,
      typeof endTimeBuffer === "number" ? endTimeBuffer : 0,
    );
    return toDateTimeString(endTime);
  } else {
    return "";
  }
}

function TravelTimeSidebarWithMutations({
  open,
  onClose,
  procedureId,
  objectType,
  appointment,
  travelTime,
}: Readonly<TravelTimeSidebarProps>) {
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  const { mutateAsync: updateInspection } = useUpdateInspection();

  function handleClose() {
    sidebarFormRef.current?.resetForm();
    onClose();
  }

  async function handleSubmit(formValues: TravelTimeFormType) {
    const travelTime = {
      startBufferInMinutes:
        typeof formValues.startBuffer === "number"
          ? formValues.startBuffer
          : undefined,
      startTime: isEmptyString(formValues.startTime)
        ? undefined
        : new Date(formValues.startTime),
      endBufferInMinutes:
        typeof formValues.endBuffer === "number"
          ? formValues.endBuffer
          : undefined,
      endTime: isEmptyString(formValues.endTime)
        ? undefined
        : new Date(formValues.endTime),
    };
    await updateInspection(
      {
        id: procedureId,
        apiUpdateInspectionRequest: { travelTime: travelTime },
      },
      {
        onSuccess: handleClose,
      },
    );
  }

  const initialValues: TravelTimeFormType = useMemo(() => {
    const startBuffer = getStartBuffer(travelTime, objectType);
    const startTime = calculateStartTime(appointment, startBuffer);
    const endBuffer = getEndBuffer(travelTime, objectType);
    const endTime = calculateEndTime(appointment, endBuffer);
    return { startBuffer, startTime, endBuffer, endTime };
  }, [appointment, objectType, travelTime]);

  const title = "Fahrzeiten";

  return (
    <Sidebar open={open} onClose={handleClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleSubmit, values, setValues }) => (
          <SidebarForm ref={sidebarFormRef} onSubmit={handleSubmit}>
            <SidebarContent title={title}>
              <Grid container columnSpacing={2} rowSpacing={3}>
                <Grid xs={12}>
                  <Typography level="title-md">Hinweg</Typography>
                </Grid>
                <Grid xs={12}>
                  <NumberField
                    name="startBuffer"
                    label="Anfahrtszeit in Minuten"
                    sx={{ maxWidth: 100 }}
                    validate={validateNonNegativeInteger}
                    onChange={(newValue) =>
                      handleStartBufferChange(
                        newValue,
                        values,
                        setValues,
                        appointment,
                      )
                    }
                  />
                </Grid>
                <Grid xs={12}>
                  <DateTimeField
                    name="startTime"
                    label="Zeitpunkt der Abfahrt"
                    validate={(value) =>
                      validateBeforeAppointment(value, appointment)
                    }
                    onChange={(newValue) =>
                      handleStartTimeChange(
                        newValue,
                        values,
                        setValues,
                        appointment,
                      )
                    }
                  />
                </Grid>
                <Grid xs={12}>
                  <Typography level="title-md">Rückweg</Typography>
                </Grid>
                <Grid xs={12}>
                  <NumberField
                    name="endBuffer"
                    label="Rückfahrzeit in Minuten"
                    sx={{ maxWidth: 100 }}
                    validate={validateNonNegativeInteger}
                    onChange={(newValue) =>
                      handleEndBufferChange(
                        newValue,
                        values,
                        setValues,
                        appointment,
                      )
                    }
                  />
                </Grid>
                <Grid xs={12}>
                  <DateTimeField
                    name="endTime"
                    label="Zeitpunkt der Rückkehr"
                    validate={(value) =>
                      validateAfterAppointment(value, appointment)
                    }
                    onChange={(newValue) =>
                      handleEndTimeChange(
                        newValue,
                        values,
                        setValues,
                        appointment,
                      )
                    }
                  />
                </Grid>
              </Grid>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitting={isSubmitting}
                submitLabel="Speichern"
                onCancel={handleClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

function validateBeforeAppointment(
  value: string,
  appointment: Appointment | undefined,
) {
  if (appointment?.start && isAfter(value, appointment.start)) {
    return "Die Abfahrt ist nach dem Beginn des Termins";
  }
  return undefined;
}

function validateAfterAppointment(
  value: string,
  appointment: Appointment | undefined,
) {
  if (appointment?.end && isBefore(value, appointment.end)) {
    return "Die Rückkehr ist vor dem Ende des Termins";
  }
  return undefined;
}

async function setDeparture(
  values: TravelTimeFormType,
  setValues: (
    values: SetStateAction<TravelTimeFormType>,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<TravelTimeFormType>>,
  startBuffer: number | string,
  startTime: string,
) {
  await setValues({
    ...values,
    startBuffer: startBuffer,
    startTime: startTime,
  });
}

async function setReturning(
  values: TravelTimeFormType,
  setValues: (
    values: SetStateAction<TravelTimeFormType>,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<TravelTimeFormType>>,
  endBuffer: number | string,
  endTime: string,
) {
  await setValues({
    ...values,
    endBuffer: endBuffer,
    endTime: endTime,
  });
}

async function handleStartBufferChange(
  startTimeBuffer: number | string,
  values: TravelTimeFormType,
  setValues: (
    values: SetStateAction<TravelTimeFormType>,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<TravelTimeFormType>>,
  appointment: ApiInspectionAppointment | undefined,
) {
  if (typeof startTimeBuffer === "string" && isEmptyString(startTimeBuffer)) {
    await setDeparture(values, setValues, "", "");
  } else if (
    typeof startTimeBuffer === "number" &&
    startTimeBuffer >= 0 &&
    appointment?.start
  ) {
    const startTime = calculateStartTime(appointment, startTimeBuffer);
    await setDeparture(values, setValues, startTimeBuffer, startTime);
  }
}

async function handleStartTimeChange(
  startTime: string,
  values: TravelTimeFormType,
  setValues: (
    values: SetStateAction<TravelTimeFormType>,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<TravelTimeFormType>>,
  appointment: ApiInspectionAppointment | undefined,
) {
  if (isEmpty(startTime)) {
    await setDeparture(values, setValues, "", "");
  } else if (
    appointment &&
    validateBeforeAppointment(startTime, appointment) === undefined
  ) {
    const startTimeBuffer = durationBetweenDatesInMinutes(
      new Date(startTime),
      appointment.start,
    );
    await setDeparture(values, setValues, startTimeBuffer, startTime);
  }
}

async function handleEndBufferChange(
  endTimeBuffer: number | string,
  values: TravelTimeFormType,
  setValues: (
    values: SetStateAction<TravelTimeFormType>,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<TravelTimeFormType>>,
  appointment: ApiInspectionAppointment | undefined,
) {
  if (typeof endTimeBuffer === "string" && isEmptyString(endTimeBuffer)) {
    await setReturning(values, setValues, "", "");
  } else if (
    typeof endTimeBuffer === "number" &&
    endTimeBuffer >= 0 &&
    appointment?.end
  ) {
    const endTime = calculateEndTime(appointment, endTimeBuffer);
    await setReturning(values, setValues, endTimeBuffer, endTime);
  }
}

async function handleEndTimeChange(
  endTime: string,
  values: TravelTimeFormType,
  setValues: (
    values: SetStateAction<TravelTimeFormType>,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<TravelTimeFormType>>,
  appointment: ApiInspectionAppointment | undefined,
) {
  if (isEmpty(endTime)) {
    await setReturning(values, setValues, "", "");
  } else if (
    appointment &&
    validateAfterAppointment(endTime, appointment) === undefined
  ) {
    const endTimeBuffer = durationBetweenDatesInMinutes(
      appointment.end,
      new Date(endTime),
    );
    await setReturning(values, setValues, endTimeBuffer, endTime);
  }
}
