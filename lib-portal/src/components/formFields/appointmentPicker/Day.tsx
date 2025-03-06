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
  date: Date | null;
  currentInterval: Interval;
}

export const DaysGrid = styled("div", {
  shouldForwardProp: (propName) =>
    !["columns", "padDays"].includes(propName as string),
})<{ columns?: number; padDays?: boolean }>(
  ({ columns = 7, padDays = true }) => ({
    display: "grid",
    gap: "8px",
    gridTemplateColumns: `repeat(${columns}, 36px)`,
    gridTemplateRows: `repeat(${padDays ? 7 : 6}, 40px)`,
    textAlign: "center",
    justifyContent: "space-between",
    width: "100%",
  }),
);

export function Day({
  date,
  currentInterval,
  selectedDay: selectedDate,
  onDateSelected,
  appointments: monthAppointments,
}: DayProps) {
  const theme = useTheme();
  if (date == null) {
    return <div></div>;
  }
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
    <Stack
      sx={{ alignItems: "center" }}
      component={"time"}
      dateTime={formatISO(date, { representation: "date" })}
    >
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
          margin: "2px",
          minHeight: "32px",
          width: "32px",
        }}
        onClick={() => onDateSelected(date)}
        {...boldProp}
      >
        {date.getDate()}
      </Button>
      {hasAppointments && !isSelected ? (
        <AppointmentMarker aria-hidden />
      ) : null}
    </Stack>
  );
}

const AppointmentMarker = styled("div")`
  background-color: ${({ theme }) => theme.palette.primary[500]};
  height: ${({ theme }) => theme.spacing(0.5)};
  width: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.md};
`;
