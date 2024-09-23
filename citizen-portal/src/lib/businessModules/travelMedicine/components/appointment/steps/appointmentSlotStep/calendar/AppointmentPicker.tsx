/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/citizen-portal-api/travelMedicine";
import { durationBetweenDatesInMinutes } from "@eshg/lib-portal/helpers/dateTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Stack } from "@mui/joy";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import { useFormikContext } from "formik";
import { useCallback, useState } from "react";

import { AppointmentDayPicker } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/calendar/AppointmentDayPicker";
import { AppointmentTimePicker } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/calendar/AppointmentTimePicker";
import { InitialAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/appointment/types";

export function AppointmentPicker({
  filteredAppointments,
}: Readonly<{
  filteredAppointments: ApiAppointment[];
}>) {
  const [isAppointmentDaySelected, setIsAppointmentDaySelected] =
    useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<
    ApiAppointment[]
  >([]);

  const { values, errors, setFieldValue } =
    useFormikContext<InitialAppointmentFormValues>();

  const handelAvailableAppointmentsSelection = useCallback(
    (appointments: ApiAppointment[]) => {
      setAvailableAppointments(appointments);
      setIsAppointmentDaySelected(true);
    },
    [],
  );

  function handleAppointmentSelection(api: ApiAppointment) {
    void setFieldValue(
      "appointmentBlockDate",
      `${api.start.toISOString()},${durationBetweenDatesInMinutes(
        api.start,
        api.end,
      )}`,
    );
  }

  function resetSelectedAppointment() {
    void setFieldValue("appointmentBlockDate", "");
  }

  function onDisplayedMonthChanged() {
    resetSelectedAppointment();
    setIsAppointmentDaySelected(false);
    setAvailableAppointments([]);
  }

  // Needed when the user already selected an appointment but later navigates back to the
  // AppointmentSlotStep to make changes. Returns the selected appointment date without time and duration
  function getSelectedAppointmentDateFromContext() {
    // remove appointment time and duration
    return values.appointmentBlockDate.split("T")[0];
  }

  function getSelectedAppointmentFromContext() {
    let selectedDate = "";
    // remove appointment duration
    const date = values.appointmentBlockDate.split(",")[0];
    if (date) {
      selectedDate = new Date(date).toString();
    }
    return selectedDate;
  }

  return (
    <Stack data-testid="appointment-picker">
      {errors.appointmentBlockDate && (
        <Typography
          data-testid="appointment-picker-helper-text"
          startDecorator={<InfoOutlinedIcon size="md" />}
          color="danger"
          sx={{ marginBottom: 2 }}
        >
          {errors.appointmentBlockDate}
        </Typography>
      )}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid sm={6} xs={12}>
          <AppointmentDayPicker
            appointmentDayCandidates={filteredAppointments}
            preselectedAppointmentDate={getSelectedAppointmentDateFromContext()}
            onAvailableAppointmentsSelected={
              handelAvailableAppointmentsSelection
            }
            onDisplayedMonthChanged={onDisplayedMonthChanged}
            resetPreviousSelectedAppointment={resetSelectedAppointment}
          />
        </Grid>
        <Grid sm={6} xs={12}>
          <AppointmentTimePicker
            onAppointmentDateAndTimeSelected={handleAppointmentSelection}
            availableAppointments={availableAppointments}
            isAppointmentDaySelected={isAppointmentDaySelected}
            selectedAppointmentDayAndTime={getSelectedAppointmentFromContext()}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
