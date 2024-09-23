/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/joy";
import {
  Interval,
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  formatISO,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { PropsWithChildren, useId } from "react";

import { Row } from "@/lib/shared/Row";

const DaysGrid = styled("div")`
  display: grid;
  column-gap: 16px;
  row-gap: 8px;
  grid-template-columns: repeat(7, 36px);
  grid-template-rows: repeat(7, 36px);
  text-align: center;
`;

function getMonthInterval(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return { start, end };
}

function getDays(interval: { start: Date; end: Date }) {
  let { start } = interval;
  const startDiff = start.getDay() - 1;
  if (startDiff != 0) {
    start = addDays(start, (startDiff > 0 ? 0 : -7) - startDiff);
  }
  let days = eachDayOfInterval({ start, end: interval.end });
  const requiredPadding = Math.ceil(days.length / 7) * 7 - days.length;
  if (requiredPadding > 0) {
    const last = days[days.length - 1];
    const paddingDays = new Array(requiredPadding)
      .fill(last)
      .map((day: Date, index) => addDays(day, index + 1));
    days = [...days, ...paddingDays];
  }
  return days;
}

interface AppointmentCalendarProps extends MonthSelectionProps {
  selectedDay: Date | undefined;
  onDateSelected: (d: Date) => unknown;
  monthAppointments: Date[];
}
export function AppointmentCalendar({
  selectedDay: selectedDate,
  onDateSelected,
  monthAppointments,
  currentMonth,
  setCurrentMonth,
}: AppointmentCalendarProps) {
  const currentInterval = getMonthInterval(currentMonth);
  const days = getDays(currentInterval);
  return (
    <div style={{ width: "min-content" }}>
      <Row justifyContent="space-around">
        <MonthSelection
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
        />
        <DaysGrid role="group" aria-label={monthLabel(currentMonth)}>
          <WeekHeader>Mo</WeekHeader>
          <WeekHeader>Di</WeekHeader>
          <WeekHeader>Mi</WeekHeader>
          <WeekHeader>Do</WeekHeader>
          <WeekHeader>Fr</WeekHeader>
          <WeekHeader>Sa</WeekHeader>
          <WeekHeader>So</WeekHeader>
          {days.map((t) => (
            <Day
              key={t.toString()}
              date={t}
              monthAppointments={monthAppointments}
              selectedDay={selectedDate}
              onDateSelected={onDateSelected}
              currentInterval={currentInterval}
            />
          ))}
        </DaysGrid>
      </Row>
    </div>
  );
}

const monthNameForm = Intl.DateTimeFormat("de-DE", { month: "long" });

function monthLabel(currentMonth: Date) {
  return `${monthNameForm.format(currentMonth)} ${currentMonth.getFullYear()}`;
}

export interface MonthSelectionProps {
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
}
function MonthSelection({
  currentMonth,
  setCurrentMonth,
}: MonthSelectionProps) {
  const monthYearId = useId();
  return (
    <Row justifyContent="space-between" width="100%" alignItems="center">
      <Typography
        level="title-md"
        id={monthYearId}
        aria-label="Termin Kalendermonat"
      >
        {monthLabel(currentMonth)}
      </Typography>
      <Row gap={2}>
        <IconButton
          size="sm"
          color="primary"
          variant="outlined"
          aria-label="im Vormonat"
          aria-controls={monthYearId}
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          size="sm"
          color="primary"
          variant="outlined"
          aria-label="im Folgemonat"
          aria-controls={monthYearId}
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight />
        </IconButton>
      </Row>
    </Row>
  );
}

function WeekHeader({ children }: PropsWithChildren) {
  return (
    <Box
      role="columnheader"
      aria-label=""
      fontWeight="bold"
      justifyContent="center"
      alignItems="center"
      display="flex"
      aria-hidden
    >
      {children}
    </Box>
  );
}

function isSunday(date: Date) {
  return date.getDay() === 0;
}

function isWeekendOrOutOfMonth(date: Date, month: Interval) {
  return (
    isSunday(date) || date.getDay() === 6 || !isWithinInterval(date, month)
  );
}

const dateInMonthForm = Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  weekday: "long",
});

interface DayProps
  extends Omit<AppointmentCalendarProps, "currentMonth" | "setCurrentMonth"> {
  date: Date;
  currentInterval: Interval;
}
function Day({
  date,
  currentInterval,
  selectedDay: selectedDate,
  onDateSelected,
  monthAppointments,
}: DayProps) {
  // const inActiveInterval = isWithinInterval(currentInterval, date);
  const theme = useTheme();
  const boldProp = isSunday(date)
    ? { fontWeight: "bold" }
    : { fontWeight: "normal" };
  const grayOut = {
    color: isWeekendOrOutOfMonth(date, currentInterval)
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
      aria-selected={isSelected}
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
