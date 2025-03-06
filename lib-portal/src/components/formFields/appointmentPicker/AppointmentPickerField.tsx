/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, FormHelperText, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isSameDay } from "date-fns";
import { useFormikContext } from "formik";
import { ReactNode, useEffect, useId, useState } from "react";
import { isDate } from "remeda";

import { getPropertyIf } from "../../../helpers/getProperty";
import { useBaseField } from "../BaseField";

import {
  AppointmentCalendar,
  AppointmentCalendarProps,
  MonthSelectionPassThroughProps,
} from "./AppointmentCalendar";
import {
  AppointmentListForDate,
  AppointmentListLabelType,
  AppointmentListProps,
  useAppointmentList,
} from "./AppointmentListForDate";
import { Weekday } from "./helpers";

export { FIELD_LABELS_DE } from "./labels";

export interface Appointment {
  start: Date;
  end?: Date;
}

export interface AppointmentPickerLayoutProps {
  calendar: ReactNode;
  calendarError?: ReactNode;
  appointmentList: ReactNode;
  sx?: SxProps;
  className?: string;
  labels: AppointmentPickerFieldLabels;
}

export interface AppointmentPickerFieldLabels {
  listLabel: AppointmentListLabelType;
  monthSelection: string;
  nextMonth: string;
  prevMonth: string;
  requiredDay: string;
  requiredAppointment: string;
  calendarLabel?: string;
  availableLegend?: string;
}

export interface AppointmentPickerFieldProps<T extends Appointment>
  extends MonthSelectionPassThroughProps {
  name: string;
  sx?: SxProps;
  required?: boolean;
  className?: string;
  active?: boolean;
  monthAppointments: T[];
  onAppointmentSelected?: (d: T) => unknown;
  onDateSelected?: (d: Date) => unknown;
  isAppointmentEqual?: (apt1: T, apt2: T) => boolean;
  layout?: (props: AppointmentPickerLayoutProps) => ReactNode;
  appointmentList?: (props: AppointmentListProps<T>) => ReactNode;
  labels: AppointmentPickerFieldLabels;
  showWeekdays?: Weekday[];
  padDays?: boolean;
  autoSelectFirst?: true;
  slotProps?: {
    calendar?: AppointmentCalendarProps["slotProps"];
  };
}

export function AppointmentPickerField<T extends Appointment>({
  sx,
  className,
  active = true,
  currentMonth,
  setCurrentMonth,
  monthAppointments,
  onAppointmentSelected,
  isAppointmentEqual,
  required,
  appointmentList: AppointmentListOverride,
  layout,
  labels,
  showWeekdays,
  slotProps,
  padDays,
  onDateSelected,
  autoSelectFirst,
  ...props
}: AppointmentPickerFieldProps<T>) {
  const {
    listLabel,
    monthSelection: monthSelectionLabel,
    nextMonth: nextMonthLabel,
    prevMonth: prevMonthLabel,
    requiredDay: requiredDayWarning,
    requiredAppointment: requiredAppointmentWarning,
  } = labels;
  const { getFieldMeta, getFieldHelpers } = useFormikContext();
  const { value, error } = getFieldMeta(props.name);
  const { setValue } = getFieldHelpers(props.name);
  const start = getPropertyIf(value, "start", isDate);
  const [selectedDay, setSelectedDayRaw] = useState<Date | undefined>(start);
  const requiredWarning =
    selectedDay == null ? requiredDayWarning : requiredAppointmentWarning;
  const field = useBaseField<T | null>({
    ...props,
    required: active && required ? requiredWarning : undefined,
  });

  const listProps = useAppointmentList({
    selectedDay,
    monthAppointments,
    listLabel,
  });

  function setSelectedDay(d: Date) {
    setSelectedDayRaw(d);
    if (!selectedDay || !isSameDay(d, selectedDay)) {
      void field.helpers.setValue(null);
    }
    onDateSelected?.(d);
  }

  // When auto select first is on
  // auto-select the first appointment in the list
  useEffect(() => {
    const appt = monthAppointments[0];
    if (autoSelectFirst == null || selectedDay != null || appt == null) {
      return;
    }
    setSelectedDayRaw(appt.start);
    onDateSelected?.(appt.start);
    void setValue(appt);
    onAppointmentSelected?.(appt);
  }, [
    selectedDay,
    setValue,
    monthAppointments,
    autoSelectFirst,
    onDateSelected,
    onAppointmentSelected,
  ]);

  const dateAppointments = monthAppointments.map((t) => t.start);

  const Layout = layout ?? DefaultLayout;
  const AppointmentList = AppointmentListOverride ?? AppointmentListForDate;
  const calendarErrorId = useId();
  const hasCalendarError = selectedDay == null && error;
  const calendarError = hasCalendarError ? (
    <FormHelperText
      component="p"
      sx={(theme) => ({ my: 1, color: theme.palette.danger.plainColor })}
      id={calendarErrorId}
      aria-live="polite"
    >
      {error}
    </FormHelperText>
  ) : undefined;

  return (
    <Layout
      className={className}
      sx={sx}
      labels={labels}
      calendar={
        <AppointmentCalendar
          selectedDay={active ? selectedDay : undefined}
          onDateSelected={setSelectedDay}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          appointments={dateAppointments}
          monthSelectionLabel={monthSelectionLabel}
          nextMonthLabel={nextMonthLabel}
          prevMonthLabel={prevMonthLabel}
          showWeekdays={showWeekdays}
          slotProps={slotProps?.calendar}
          padDays={padDays}
          errorMessageId={hasCalendarError ? calendarErrorId : undefined}
        />
      }
      calendarError={calendarError}
      appointmentList={
        <FormControl
          error={field.error}
          required={field.required}
          sx={{ flex: 1 }}
        >
          <AppointmentList
            {...listProps}
            field={field}
            date={active ? selectedDay : undefined}
            onAppointmentSelected={onAppointmentSelected}
            isAppointmentEqual={isAppointmentEqual}
          />
          {field.helperText != null && (
            <FormHelperText component="p" sx={{ my: 1 }} aria-live="polite">
              {field.helperText}
            </FormHelperText>
          )}
        </FormControl>
      }
    />
  );
}

function DefaultLayout({
  sx,
  className,
  calendar,
  calendarError,
  appointmentList,
}: AppointmentPickerLayoutProps) {
  const givenSx = sx == null ? [] : sx instanceof Array ? sx : [sx];
  const sxProps = [{ margin: 0, padding: 0, border: 0 }, ...givenSx];
  return (
    <Stack
      component={"fieldset"}
      sx={sxProps}
      className={className}
      aria-label={"Terminkalender"}
    >
      {calendar}
      {calendarError}
      {appointmentList}
    </Stack>
  );
}
