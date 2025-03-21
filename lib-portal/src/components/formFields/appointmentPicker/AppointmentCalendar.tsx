/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/joy";

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
export interface AppointmentCalendarProps
  extends MonthSelectionPassThroughProps {
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
  return (
    <Box>
      <Row justifyContent="space-around">
        <MonthSelection
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          label={monthSelectionLabel}
          nextMonthLabel={nextMonthLabel}
          prevMonthLabel={prevMonthLabel}
          slotProps={slotProps?.monthSelection}
          locale={locale}
        />
        <MonthGrid
          errorMessageId={errorMessageId}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          onDateSelected={onDateSelected}
          appointments={appointments}
          padDays={padDays}
          showWeekdays={showWeekdays}
          locale={locale}
        />
      </Row>
    </Box>
  );
}

export function MonthGrid({
  appointments,
  selectedDay,
  onDateSelected,
  currentMonth,
  showWeekdays,
  padDays,
  errorMessageId,
  locale,
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
>) {
  const currentInterval = getMonthInterval(currentMonth);
  const days = getDaysInAndAroundMonth(currentInterval, {
    showWeekdays,
    padDays,
  });
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
          onDateSelected={onDateSelected}
          currentInterval={currentInterval}
          locale={locale}
        />
      ))}
    </DaysGrid>
  );
}
