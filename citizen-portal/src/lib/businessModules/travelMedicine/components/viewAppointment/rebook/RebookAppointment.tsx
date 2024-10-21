/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/citizen-portal-api/travelMedicine";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { durationBetweenDatesInMinutes } from "@eshg/lib-portal/helpers/dateTime";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Grid, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useCallback, useState } from "react";

import { AppointmentDayPicker } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/calendar/AppointmentDayPicker";
import { AppointmentTimePicker } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/calendar/AppointmentTimePicker";
import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { RebookAppointmentFormValues } from "@/lib/businessModules/travelMedicine/components/viewAppointment/rebook/RebookAppointmentPageContent";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";

export function RebookAppointment({
  appointments,
}: Readonly<{
  appointments: ApiAppointment[];
}>) {
  const { t } = useTranslation(["travelMedicine/rebookAppointment"]);
  const { values, setFieldValue, errors } =
    useFormikContext<RebookAppointmentFormValues>();

  const [isAppointmentDaySelected, setIsAppointmentDaySelected] =
    useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<
    ApiAppointment[]
  >([]);

  const handelAvailableAppointmentsSelection = useCallback(
    (appointments: ApiAppointment[]) => {
      setAvailableAppointments(appointments);
      setIsAppointmentDaySelected(true);
    },
    [],
  );

  function handleAppointmentSelection(api: ApiAppointment) {
    void setFieldValue(
      "selectedAppointment",
      `${api.start.toISOString()},${durationBetweenDatesInMinutes(
        api.start,
        api.end,
      )}`,
    );
  }

  function resetSelectedAppointment() {
    void setFieldValue("selectedAppointment", "");
  }

  function onDisplayedMonthChanged() {
    resetSelectedAppointment();
    setIsAppointmentDaySelected(false);
    setAvailableAppointments([]);
  }

  function getSelectedAppointmentFromContext() {
    let selectedDate = "";
    const date = values.selectedAppointment?.split(",")[0];
    if (date) {
      selectedDate = new Date(date).toString();
    }
    return selectedDate;
  }

  return (
    <ContentSheet data-testid="rebook-appointment-content-form">
      <FormSheetTitle requiredTitle={t("content.requiredTitle")}>
        {t("content.title")}
      </FormSheetTitle>
      <Alert
        title={t("content.infoPanelTitle")}
        message={t("content.infoPanelText")}
        color="primary"
      />
      <Stack data-testid="appointment-picker">
        {errors.selectedAppointment && (
          <Typography
            data-testid="appointment-picker-helper-text"
            startDecorator={<InfoOutlinedIcon size="md" />}
            color="danger"
            sx={{ marginBottom: 2 }}
          >
            {errors.selectedAppointment}
          </Typography>
        )}
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <AppointmentDayPicker
              appointmentDayCandidates={appointments}
              onAvailableAppointmentsSelected={
                handelAvailableAppointmentsSelection
              }
              onDisplayedMonthChanged={onDisplayedMonthChanged}
              resetPreviousSelectedAppointment={resetSelectedAppointment}
            />
          </Grid>
          <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
            <AppointmentTimePicker
              onAppointmentDateAndTimeSelected={handleAppointmentSelection}
              availableAppointments={availableAppointments}
              isAppointmentDaySelected={isAppointmentDaySelected}
              selectedAppointmentDayAndTime={getSelectedAppointmentFromContext()}
            />
          </Grid>
        </Grid>
      </Stack>
    </ContentSheet>
  );
}
