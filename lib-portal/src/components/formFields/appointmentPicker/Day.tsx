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
import { useEffect, useRef } from "react";

import { AppointmentCalendarProps } from "./AppointmentCalendar";
import { MonthSelectionProps } from "./MonthSelection";
import { dateInMonthForm } from "./helpers";

interface DayProps
  extends Omit<
    AppointmentCalendarProps,
    "monthSelectionLabel" | keyof MonthSelectionProps
  > {
  locale: string;
  date: Date | null;
  focusedDay: Date | null;
  currentInterval: Interval;
  isFirst: boolean;
  onDayFocused: AppointmentCalendarProps["onDateSelected"];
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
  selectedDay,
  focusedDay,
  onDayFocused,
  onDateSelected: onDaySelected,
  appointments: monthAppointments,
  locale,
  isFirst,
}: DayProps) {
  const theme = useTheme();

  const cellRef = useRef<HTMLTimeElement>(null);
  const isFocused = date && focusedDay && isSameDay(focusedDay, date);
  useEffect(() => {
    if (!isFocused) {
      return;
    }
    cellRef.current?.focus();
  }, [isFocused, cellRef]);

  if (date == null) {
    return <div />;
  }

  const boldProp = isSunday(date)
    ? { fontWeight: "bold" }
    : { fontWeight: "normal" };
  const grayOut = {
    color: !isWithinInterval(date, currentInterval)
      ? theme.palette.text.secondary
      : theme.palette.text.primary,
  };
  const isSelected = selectedDay != null && isSameDay(selectedDay, date);
  const selectedStyles = isSelected
    ? { borderRadius: "100%", color: theme.palette.common.white }
    : {};
  const tabIntoProps =
    isSelected || (isFirst && selectedDay == null) ? {} : { tabIndex: -1 };

  const dayInterval = { start: startOfDay(date), end: endOfDay(date) };

  const hasAppointments = monthAppointments.some((t) =>
    isWithinInterval(t, dayInterval),
  );

  function handleFocus() {
    if (!date) {
      return;
    }
    onDayFocused(date);
  }

  return (
    <Stack
      sx={{ alignItems: "center" }}
      role="gridcell"
      aria-selected={isSelected || undefined}
      aria-label={dateInMonthForm(locale).format(date)}
      aria-disabled={!hasAppointments}
    >
      <Button
        ref={cellRef}
        component="time"
        aria-pressed={isSelected}
        dateTime={formatISO(date, { representation: "date" })}
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
        onFocus={handleFocus}
        onClick={() => onDaySelected(date)}
        {...tabIntoProps}
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
