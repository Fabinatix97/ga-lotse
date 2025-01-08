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
  getDaysInAndAroundMonth,
  getMonthInterval,
  monthLabel,
} from "./helpers";

export type MonthSelectionPassThroughProps = Omit<
  MonthSelectionProps,
  "label" | "nextMonthLabel" | "prevMonthLabel"
>;
export interface AppointmentCalendarProps
  extends MonthSelectionPassThroughProps {
  selectedDay: Date | undefined;
  onDateSelected: (d: Date) => unknown;
  appointments: Date[];
  monthSelectionLabel: string;
  nextMonthLabel: string;
  prevMonthLabel: string;
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
}: AppointmentCalendarProps) {
  return (
    <Box
      sx={{ width: "min-content" }}
      data-testid="appointment-picker-calender"
    >
      <Row justifyContent="space-around">
        <MonthSelection
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          label={monthSelectionLabel}
          nextMonthLabel={nextMonthLabel}
          prevMonthLabel={prevMonthLabel}
        />
        <MonthGrid
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          onDateSelected={onDateSelected}
          appointments={appointments}
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
}: Pick<
  AppointmentCalendarProps,
  "selectedDay" | "onDateSelected" | "currentMonth" | "appointments"
>) {
  const currentInterval = getMonthInterval(currentMonth);
  const days = getDaysInAndAroundMonth(currentInterval);
  return (
    <DaysGrid role="grid" aria-label={monthLabel(currentMonth)}>
      <WeekdayHeaders />
      {days.map((t) => (
        <Day
          key={t.toString()}
          date={t}
          appointments={appointments}
          selectedDay={selectedDay}
          onDateSelected={onDateSelected}
          currentInterval={currentInterval}
        />
      ))}
    </DaysGrid>
  );
}
