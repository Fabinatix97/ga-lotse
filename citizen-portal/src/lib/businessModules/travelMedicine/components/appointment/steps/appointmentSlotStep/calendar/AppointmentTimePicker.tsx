/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/travel-medicine-api";
import { Stack } from "@mui/joy";
import Button from "@mui/joy/Button/Button";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import { formatDate } from "date-fns";

import { NoAppointments } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/NoAppointments";
import { useTranslation } from "@/lib/i18n/client";

interface AppointmentPickerProps {
  availableAppointments: ApiAppointment[];
  onAppointmentDateAndTimeSelected: (appointment: ApiAppointment) => void;
  isAppointmentDaySelected: boolean;
  selectedAppointmentDayAndTime: string;
}

export function AppointmentTimePicker({
  availableAppointments,
  onAppointmentDateAndTimeSelected,
  isAppointmentDaySelected,
  selectedAppointmentDayAndTime,
}: Readonly<AppointmentPickerProps>) {
  const { t } = useTranslation(["travelMedicine/forms"]);

  function isButtonSelected(appointment: string) {
    return appointment === selectedAppointmentDayAndTime;
  }

  function invalidDaySelected() {
    return availableAppointments.length === 0 && isAppointmentDaySelected;
  }

  function noDaySelected() {
    return availableAppointments.length === 0 && !isAppointmentDaySelected;
  }

  return (
    <Stack data-testid="appointment-time-picker">
      <Typography fontWeight="bold" sx={{ marginBottom: 2 }}>
        {t("appointmentSlotFormContent.appointmentPicker.timePicker_title")}
        <sup> *</sup>
      </Typography>
      {availableAppointments.length > 0 && (
        <Grid container spacing={2}>
          {availableAppointments.map((appointment) => (
            <Grid
              xl={4}
              lg={4}
              md={4}
              sm={4}
              xs={4}
              xxs={4}
              key={appointment.start.toString()}
            >
              <Button
                data-testid={
                  isButtonSelected(appointment.start.toString())
                    ? "appointment-picker-slot-selected"
                    : null
                }
                onClick={() => {
                  onAppointmentDateAndTimeSelected(appointment);
                }}
                variant={
                  isButtonSelected(appointment.start.toString())
                    ? "solid"
                    : "soft"
                }
                sx={{ width: "100%" }}
              >
                {formatDate(appointment.start, "H:mm")}
              </Button>
            </Grid>
          ))}
        </Grid>
      )}
      {invalidDaySelected() && (
        <NoAppointments>
          <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
            {t(
              "appointmentSlotFormContent.appointmentPicker.noAppointmentForSelectedDate",
            )}
          </Typography>
        </NoAppointments>
      )}
      {noDaySelected() && (
        <NoAppointments>
          <Typography level="title-md">
            {t(
              "appointmentSlotFormContent.appointmentPicker.noAppointmentSelected",
            )}
          </Typography>
        </NoAppointments>
      )}
    </Stack>
  );
}
