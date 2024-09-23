/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointment } from "@eshg/citizen-portal-api/travelMedicine";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack/Stack";
import Typography from "@mui/joy/Typography";
import { formatDate, isAfter } from "date-fns";
import { isBefore } from "date-fns/isBefore";
import { useCallback, useEffect, useRef, useState } from "react";

import { AppointmentDayPickerHeader } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/calendar/AppointmentDayPickerHeader";
import { appointmentDayPickerSxProps } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/calendar/appointmentDayPickerSxProps";
import { CalendarViewTypes } from "@/lib/businessModules/travelMedicine/components/appointment/steps/appointmentSlotStep/calendar/calendarViews";
import { useTranslation } from "@/lib/i18n/client";

interface AppointmentDatePickerProps {
  appointmentDayCandidates: ApiAppointment[];
  onAvailableAppointmentsSelected: (appointments: ApiAppointment[]) => void;
  resetPreviousSelectedAppointment: () => void;
  preselectedAppointmentDate?: string;
  onDisplayedMonthChanged: () => void;
}

export function AppointmentDayPicker({
  appointmentDayCandidates,
  onAvailableAppointmentsSelected,
  resetPreviousSelectedAppointment,
  preselectedAppointmentDate,
  onDisplayedMonthChanged,
}: Readonly<AppointmentDatePickerProps>) {
  const fullCalendarRef = useRef<FullCalendar>(null);
  const [fullCalendarTitle, setFullCalendarTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); //formatDate(new Date(), "yyyy-MM-dd"),

  const { t } = useTranslation(["travelMedicine/forms"]);

  const [availableAppointmentEvents, setAvailableAppointmentEvents] =
    useState<{ start: string }[]>();

  const end = getLastDayForValidRange();
  const start = getFirstDayForValidRange();

  function getLastDayForValidRange() {
    return appointmentDayCandidates[appointmentDayCandidates.length - 1]!.end;
  }

  function getFirstDayForValidRange() {
    return appointmentDayCandidates[0]!.start;
  }

  function handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    updateAppointmentEvents(selectInfo.startStr);
  }

  const updateAppointmentEvents = useCallback(
    (startStr: string) => {
      const oldSelectedDateEl = document.querySelector<HTMLElement>(
        `[data-date='${selectedDate}']`,
      );
      if (oldSelectedDateEl) {
        oldSelectedDateEl.classList.remove("selected-date");
      }

      const selectedDateEl = document.querySelector<HTMLElement>(
        `[data-date='${startStr}']`,
      );
      if (selectedDateEl) {
        selectedDateEl.classList.add("selected-date");
        setSelectedDate(startStr);
      }
    },
    [setSelectedDate, selectedDate],
  );

  const updateAppointmentsForSelectedDay = useCallback(
    (date: string) => {
      const filteredAppointments = appointmentDayCandidates.filter(
        (appointment) => formatDate(appointment.start, "yyyy-MM-dd") === date,
      );
      onAvailableAppointmentsSelected(filteredAppointments);
    },
    [onAvailableAppointmentsSelected, appointmentDayCandidates],
  );

  const updateAvailableAppointmentEvents = useCallback(() => {
    let availableAppointmentEvents: { start: string }[] = [];
    appointmentDayCandidates.forEach((appointment) => {
      availableAppointmentEvents.push({
        start: formatDate(appointment.start, "yyyy-MM-dd"),
      });
    });
    availableAppointmentEvents = Array.from(
      new Set(availableAppointmentEvents.map((item) => item.start)),
    ).map((date) => ({ start: date }));
    setAvailableAppointmentEvents(availableAppointmentEvents);
  }, [appointmentDayCandidates]);

  function updateFreeAppointments(startStr: string) {
    const filteredAppointments = appointmentDayCandidates.filter(
      (appointment) => formatDate(appointment.start, "yyyy-MM-dd") === startStr,
    );
    onAvailableAppointmentsSelected(filteredAppointments);
  }

  useEffect(() => {
    if (preselectedAppointmentDate) {
      updateAppointmentsForSelectedDay(preselectedAppointmentDate);
      updateAppointmentEvents(preselectedAppointmentDate);
    }
  }, [
    preselectedAppointmentDate,
    updateAppointmentsForSelectedDay,
    updateAppointmentEvents,
  ]);

  useEffect(() => {
    updateAvailableAppointmentEvents();
  }, [updateAvailableAppointmentEvents]);

  function checkIfPrevMonthDisplayIsAllowed() {
    return isAfter(fullCalendarRef.current!.getApi().view.activeStart, start);
  }

  function checkIfNextMonthDisplayIsAllowed() {
    return isBefore(fullCalendarRef.current!.getApi().view.activeEnd, end);
  }

  return (
    <>
      <Typography fontWeight="bold" sx={{ marginBottom: 2 }}>
        {t("appointmentSlotFormContent.appointmentPicker.calendar_title")}
        <sup> *</sup>
      </Typography>
      <Stack
        gap={2}
        sx={(theme) => appointmentDayPickerSxProps(theme)}
        data-testid="appointment-day-picker"
      >
        <AppointmentDayPickerHeader
          title={fullCalendarTitle}
          goToPrevious={() => {
            if (checkIfPrevMonthDisplayIsAllowed()) {
              fullCalendarRef.current?.getApi().prev();
              onDisplayedMonthChanged();
            }
          }}
          goToNext={() => {
            if (checkIfNextMonthDisplayIsAllowed()) {
              fullCalendarRef.current?.getApi().next();
              onDisplayedMonthChanged();
            }
          }}
        />
        <FullCalendar
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          initialDate={preselectedAppointmentDate || start}
          ref={fullCalendarRef}
          locale={deLocale}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView={CalendarViewTypes.DayGridMonth}
          height="auto"
          headerToolbar={false}
          datesSet={({ view }) => {
            setFullCalendarTitle(view.title);
          }}
          fixedWeekCount={true}
          showNonCurrentDates={false}
          weekends={false}
          selectable={true}
          select={(info) => {
            resetPreviousSelectedAppointment();
            handleDateSelect(info);
            updateFreeAppointments(info.startStr);
          }}
          events={availableAppointmentEvents}
        ></FullCalendar>
      </Stack>
      <Typography
        sx={{ marginTop: 3 }}
        startDecorator={
          <Box
            sx={{
              backgroundColor: "#0B6BCB",
              height: "4px",
              width: "10px",
            }}
          />
        }
      >
        {t("appointmentSlotFormContent.appointmentPicker.available")}
      </Typography>
    </>
  );
}
