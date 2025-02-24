/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentListProps } from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentListForDate";
import {
  Appointment,
  AppointmentPickerField,
  AppointmentPickerFieldProps,
  AppointmentPickerLayoutProps,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import { isSameAppointment } from "@eshg/lib-portal/components/formFields/appointmentPicker/helpers";
import { Box, Button, ListItem, Stack, Typography, styled } from "@mui/joy";
import { useMemo, useState } from "react";

import { Row } from "@/lib/businessModules/measlesProtection/shared/components/Row";
import { TranslateFn } from "@/lib/i18n/client";

interface AppointmentPickerSectionProps<T extends Appointment> {
  name: string;
  translationPrefix?: string;
  t: TranslateFn;
  onAppointmentSelected?: (d: T) => unknown;
  onDateSelected?: (d: Date) => unknown;
  appointments: T[];
}

export function AppointmentPickerSection<T extends Appointment>({
  appointments,
  name,
  translationPrefix = "appointment_calendar",
  t,
  onAppointmentSelected,
  onDateSelected,
}: AppointmentPickerSectionProps<T>) {
  const [month, setMonth] = useState<Date>(new Date());
  const labels = useMemo(
    () => ({
      requiredAppointment: t(`${translationPrefix}.required_appointment`),
      requiredDay: t(`${translationPrefix}.required_day`),
      monthSelection: t(`${translationPrefix}.month_selection`),
      nextMonth: t(`${translationPrefix}.next_month`),
      prevMonth: t(`${translationPrefix}.prev_month`),
      listLabel: t(`${translationPrefix}.list_label`),
      calendarLabel: t(`${translationPrefix}.calendar_label`),
      availableLegend: t(`${translationPrefix}.available`),
    }),
    [t, translationPrefix],
  );

  return (
    <AppointmentPickerField
      name={name}
      currentMonth={month}
      setCurrentMonth={setMonth}
      autoSelectFirst
      monthAppointments={appointments}
      required={true}
      labels={labels}
      onAppointmentSelected={onAppointmentSelected}
      onDateSelected={onDateSelected}
      showWeekdays={["monday", "tuesday", "wednesday", "thursday", "friday"]}
      layout={AppointmentPickerCitizenLayout}
      padDays={false}
      appointmentList={TimeSlotList}
      slots={AppointmentPickerCitizenSlots}
    />
  );
}

const AppointmentPickerCitizenSlots: AppointmentPickerFieldProps<Appointment>["slots"] =
  {
    calendar: {
      monthSelection: {
        arrows: {
          variant: "soft",
          sx: { backgroundColor: "white" },
        },
      },
    },
  };

function AppointmentPickerCitizenLayout({
  calendar,
  calendarError,
  appointmentList,
  labels: { calendarLabel, availableLegend },
}: AppointmentPickerLayoutProps) {
  if (!calendarLabel) {
    throw Error("Calendar Label not defined");
  }
  if (!availableLegend) {
    throw Error("Available Legend not defined");
  }
  return (
    <Row gap={3}>
      <Stack gap={2}>
        <Typography level="title-md">{calendarLabel}</Typography>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.background.level1,
            padding: 2,
            borderRadius: theme.radius.md,
            alignSelf: "start",
          })}
        >
          {calendar}
        </Box>
        <AvailableLegend label={availableLegend} />
        {calendarError}
      </Stack>
      {appointmentList}
    </Row>
  );
}

const ListGrid = styled("ol")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: theme.spacing(2),
  margin: 0,
  padding: 0,
}));

function TimeSlotList<T extends Appointment>({
  date,
  field,
  appointments,
  onAppointmentSelected,
  label,
}: AppointmentListProps<T>) {
  const hasAppointments = appointments.length > 0;
  if (!hasAppointments || !date) {
    return null;
  }

  function createOnSelected(d: T) {
    return () => {
      onAppointmentSelected?.(d);
      return field.helpers.setValue(d);
    };
  }

  return (
    <Stack gap={2}>
      <Typography level="title-md">{label}</Typography>
      <ListGrid>
        {appointments.map((apt: T) => {
          const isSelected = isSameAppointment(field.input.value, apt);
          return (
            <ListItem
              sx={{ padding: 0, minHeight: 0 }}
              key={apt.start.getTime()}
            >
              <Box
                component="time"
                sx={{ width: "100%" }}
                dateTime={apt.start.toTimeString().slice(0, 5)}
              >
                <Button
                  onClick={createOnSelected(apt)}
                  aria-selected={isSelected}
                  variant={isSelected ? "solid" : "plain"}
                  sx={(theme) => ({
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    minWidth: theme.spacing(12),
                    backgroundColor: isSelected
                      ? undefined
                      : theme.palette.background.level1,
                    width: "100%",
                  })}
                >
                  {apt.start.toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Button>
              </Box>
            </ListItem>
          );
        })}
      </ListGrid>
    </Stack>
  );
}

function AvailableLegend({ label }: { label: string }) {
  return (
    <Row alignItems="center" marginLeft={2}>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.plainColor,
          width: theme.spacing(1),
          height: theme.spacing(0.5),
          borderRadius: theme.radius.xs,
        })}
      />
      {label}
    </Row>
  );
}
