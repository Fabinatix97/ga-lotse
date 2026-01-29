/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/joy";
import { Interval, isSameDay } from "date-fns";
import { KeyboardEvent, useRef, useState } from "react";

import { Row } from "../../Row";

import { Day, DaysGrid } from "./Day";
import { MonthSelection, MonthSelectionProps } from "./MonthSelection";
import { WeekdayHeaders } from "./WeekdayHeaders";
import {
  Weekday,
  getDaysInAndAroundMonth,
  getMonthInterval,
  monthLabel,
} from "./helpers";

export type MonthSelectionPassThroughProps = Omit<
  MonthSelectionProps,
  "label" | "nextMonthLabel" | "prevMonthLabel" | "slotProps"
>;
export interface AppointmentCalendarProps extends MonthSelectionPassThroughProps {
  selectedDay: Date | undefined;
  onDateSelected: (d: Date) => unknown;
  appointments: Date[];
  monthSelectionLabel: string;
  nextMonthLabel: string;
  prevMonthLabel: string;
  showWeekdays?: Weekday[];
  padDays?: boolean;
  errorMessageId?: string;
  slotProps?: {
    monthSelection?: MonthSelectionProps["slotProps"];
  };
  locale: string;
}
export function AppointmentCalendar({
  selectedDay,
  onDateSelected,
  appointments,
  currentMonth,
  setCurrentMonth,
  monthSelectionLabel,
  nextMonthLabel,
  prevMonthLabel,
  showWeekdays,
  padDays,
  slotProps,
  errorMessageId,
  locale,
}: AppointmentCalendarProps) {
  const currentInterval = getMonthInterval(currentMonth);
  const days = getDaysInAndAroundMonth(currentInterval, {
    showWeekdays,
    padDays,
  });
  const [focusedDay, setFocusedDay] = useState(selectedDay);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const handleKeydown = useHandleKeydown({
    columns: showWeekdays?.length ?? 7,
    selectedDay,
    focusedDay,
    setFocusedDay,
    setSelectedDay: onDateSelected,
    days,
    prevMonth,
    nextMonth,
  });
  function prevMonth() {
    prevButtonRef.current?.focus();
    prevButtonRef.current?.click();
  }
  function nextMonth() {
    nextButtonRef.current?.focus();
    nextButtonRef.current?.click();
  }
  return (
    <Box
      aria-keyshortcuts="ArrowRight ArrowLeft ArrowDown ArrowUp Home End PageUp PageDown Space"
      onKeyDown={handleKeydown}
    >
      <Row justifyContent="space-around">
        <MonthSelection
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          label={monthSelectionLabel}
          nextMonthLabel={nextMonthLabel}
          prevMonthLabel={prevMonthLabel}
          slotProps={slotProps?.monthSelection}
          nextButtonRef={nextButtonRef}
          prevButtonRef={prevButtonRef}
          locale={locale}
        />
        <MonthGrid
          days={days}
          errorMessageId={errorMessageId}
          currentInterval={currentInterval}
          setFocusedDay={setFocusedDay}
          focusedDay={focusedDay}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          appointments={appointments}
          padDays={padDays}
          showWeekdays={showWeekdays}
          locale={locale}
          onDateSelected={onDateSelected}
        />
      </Row>
    </Box>
  );
}

function MonthGrid({
  appointments,
  selectedDay,
  onDateSelected,
  currentMonth,
  showWeekdays,
  padDays,
  errorMessageId,
  locale,
  days,
  focusedDay,
  setFocusedDay,
  currentInterval,
}: Pick<
  AppointmentCalendarProps,
  | "selectedDay"
  | "onDateSelected"
  | "currentMonth"
  | "appointments"
  | "showWeekdays"
  | "padDays"
  | "errorMessageId"
  | "locale"
> & {
  days: (Date | null)[];
  focusedDay: Date | undefined;
  setFocusedDay: (d: Date) => void;
  currentInterval: Interval;
}) {
  const firstAppointment = appointments[0];
  const firstAvailableDay =
    firstAppointment && days.find((t) => t && isSameDay(firstAppointment, t));

  return (
    <DaysGrid
      role="grid"
      columns={showWeekdays?.length}
      padDays={padDays}
      aria-label={monthLabel(currentMonth, locale)}
      aria-describedby={errorMessageId}
    >
      <WeekdayHeaders showWeekdays={showWeekdays} locale={locale} />
      {days.map((t, index) => (
        <Day
          key={index}
          date={t}
          appointments={appointments}
          selectedDay={selectedDay}
          focusedDay={focusedDay ?? null}
          currentInterval={currentInterval}
          locale={locale}
          isFirst={t === firstAvailableDay}
          onDateSelected={onDateSelected}
          onDayFocused={(day) => setFocusedDay(day)}
        />
      ))}
    </DaysGrid>
  );
}

function useHandleKeydown({
  columns,
  selectedDay,
  focusedDay,
  setFocusedDay,
  setSelectedDay,
  nextMonth,
  prevMonth,
  days,
}: {
  columns: number;
  selectedDay: Date | undefined;
  focusedDay: Date | undefined;
  setFocusedDay: (t: Date | undefined) => unknown;
  setSelectedDay: (t: Date) => unknown;
  nextMonth: () => void;
  prevMonth: () => void;
  days: (Date | null)[];
}) {
  const fDay = focusedDay ?? selectedDay;
  const index = days.findIndex((t) => t && fDay && isSameDay(t, fDay));

  function moveTo(newIndex: number) {
    const newDay = days[newIndex];
    if (!newDay) {
      return;
    }
    setFocusedDay(newDay);
    return newDay;
  }

  return (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight": {
        moveTo(index + 1);
        break;
      }
      case "ArrowLeft": {
        moveTo(index - 1);
        break;
      }
      case "ArrowDown":
        moveTo(index + columns);
        break;
      case "ArrowUp":
        moveTo(index - columns);
        break;
      case "Home": {
        const newFocus = days[0];
        if (newFocus) {
          setFocusedDay(newFocus);
        }
        break;
      }
      case "End": {
        const newFocus = days[days.length - 1];
        if (newFocus) {
          setFocusedDay(newFocus);
        }
        break;
      }
      case "PageUp": {
        prevMonth();
        break;
      }
      case "PageDown": {
        nextMonth();
        break;
      }
      case "Space": {
        if (!focusedDay) {
          return;
        }
        setSelectedDay(focusedDay);
        break;
      }
      default: {
        return;
      }
    }
    event.preventDefault();
  };
}
