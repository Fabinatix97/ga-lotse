/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Stack, styled, useTheme } from "@mui/joy";
import {
  Interval,
  endOfDay,
  formatISO,
  isSameDay,
  isSunday,
  isWithinInterval,
  startOfDay,
} from "date-fns";

import { AppointmentCalendarProps } from "./AppointmentCalendar";
import { MonthSelectionProps } from "./MonthSelection";
import { dateInMonthForm } from "./helpers";

export interface DayProps
  extends Omit<
    AppointmentCalendarProps,
    "monthSelectionLabel" | keyof MonthSelectionProps
  > {
  date: Date;
  currentInterval: Interval;
}

export const DaysGrid = styled("div")`
  display: grid;
  column-gap: 16px;
  row-gap: 8px;
  grid-template-columns: repeat(7, 36px);
  grid-template-rows: repeat(6, 36px);
  text-align: center;
`;

export function Day({
  date,
  currentInterval,
  selectedDay: selectedDate,
  onDateSelected,
  appointments: monthAppointments,
}: DayProps) {
  const theme = useTheme();
  const boldProp = isSunday(date)
    ? { fontWeight: "bold" }
    : { fontWeight: "normal" };
  const grayOut = {
    color: !isWithinInterval(date, currentInterval)
      ? theme.palette.text.secondary
      : theme.palette.text.primary,
  };
  const isSelected = selectedDate != null && isSameDay(selectedDate, date);
  const selectedStyles = isSelected
    ? { borderRadius: "100%", color: theme.palette.common.white }
    : {};

  const dayInterval = { start: startOfDay(date), end: endOfDay(date) };
  const hasAppointments = monthAppointments.some((t) =>
    isWithinInterval(t, dayInterval),
  );

  return (
    <Button
      aria-selected={isSelected || undefined}
      aria-label={dateInMonthForm.format(date)}
      disabled={!hasAppointments}
      color={isSelected ? "primary" : "neutral"}
      variant={isSelected ? "solid" : "plain"}
      sx={{
        ...grayOut,
        ...boldProp,
        ...selectedStyles,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => onDateSelected(date)}
      {...boldProp}
    >
      <Stack
        component={"time"}
        dateTime={formatISO(date, { representation: "date" })}
      >
        {date.getDate()}
        {hasAppointments && !isSelected && <AppointmentMarker aria-hidden />}
      </Stack>
    </Button>
  );
}

const AppointmentMarker = styled("div")`
  background-color: ${({ theme }) => theme.palette.primary[500]};
  height: ${({ theme }) => theme.spacing(0.5)};
  width: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.md};
`;
